import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  CardBody,
  Typography,
  Button,
  Input,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Select,
  Option,
} from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";

const API_DETAIL = "http://localhost:8000/api/detail-latihan";
const API_PROGRAM = "http://localhost:8000/api/program-latihan";
const BASE_URL = "http://localhost:8000/storage/";

const DetailLatihan = () => {
  const [data, setData] = useState([]);
  const [programList, setProgramList] = useState([]);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [programId, setProgramId] = useState("");
  const [namaDetail, setNamaDetail] = useState("");
  const [repetisi, setRepetisi] = useState("");
  const [durasi, setDurasi] = useState("");
  const [kategori, setKategori] = useState("strength");
  const [note, setNote] = useState("");
  const [foto, setFoto] = useState([]);
  const [preview, setPreview] = useState([]);
  const [modalPreview, setModalPreview] = useState({ open: false, src: "" });

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      alert("Silakan login terlebih dahulu.");
      return navigate("/auth/login");
    }

    fetchData(token);
    fetchPrograms(token);
  }, []);

  const fetchData = async (token) => {
    try {
      const res = await axios.get(API_DETAIL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setData(res.data);
    } catch (err) {
      console.error("Gagal fetch detail:", err);
    }
  };

  const fetchPrograms = async (token) => {
    try {
      const res = await axios.get(API_PROGRAM, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProgramList(res.data);
    } catch (err) {
      console.error("Gagal fetch program:", err);
    }
  };

  const handleOpen = (item = null) => {
    setEditId(item?.id || null);
    setProgramId(item?.program_latihan_id || "");
    setNamaDetail(item?.nama_detail || "");
    setRepetisi(item?.repetisi || "");
    setDurasi(item?.durasi || "");
    setKategori(item?.kategori || "strength");
    setNote(item?.note || "");

    // Convert foto ke array jika perlu
    let fotoArr = [];
    try {
      fotoArr = typeof item?.foto === "string" ? JSON.parse(item.foto) : item?.foto || [];
    } catch (e) {
      console.error("Gagal parsing foto");
    }

    setPreview(fotoArr.map((path) => BASE_URL + path));
    setFoto([]);
    setOpen(true);
  };

  const handleClose = () => {
    setEditId(null);
    setProgramId("");
    setNamaDetail("");
    setRepetisi("");
    setDurasi("");
    setKategori("strength");
    setNote("");
    setFoto([]);
    setPreview([]);
    setOpen(false);
  };

  const handleFotoChange = (e) => {
    const files = Array.from(e.target.files);
    setFoto(files);
    const previews = files.map((file) => URL.createObjectURL(file));
    setPreview(previews);
  };

  const handleSave = async () => {
    if (!programId || !namaDetail) return;

    const token = localStorage.getItem("access_token");
    const formData = new FormData();
    formData.append("program_latihan_id", programId);
    formData.append("nama_detail", namaDetail);
    formData.append("repetisi", repetisi);
    formData.append("durasi", durasi);
    formData.append("kategori", kategori);
    formData.append("note", note);
    foto.forEach((f) => {
      formData.append("foto[]", f);
    });

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      };

      if (editId) {
        await axios.post(`${API_DETAIL}/${editId}`, formData, config);
      } else {
        await axios.post(API_DETAIL, formData, config);
      }

      handleClose();
      fetchData(token);
    } catch (err) {
      console.error("Gagal simpan:", err.response?.data || err);
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("access_token");
    try {
      await axios.delete(`${API_DETAIL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchData(token);
    } catch (err) {
      console.error("Gagal hapus:", err);
    }
  };

  return (
    <div className="mt-10 px-6">
      <Typography variant="h4" className="mb-6 text-blue-gray-700">
        Detail Latihan
      </Typography>

      <Button onClick={() => handleOpen()} color="blue" className="mb-4">
        + Tambah Detail
      </Button>

      <Card>
        <CardBody className="overflow-x-auto">
          <table className="w-full min-w-max table-auto text-left">
            <thead>
              <tr>
                <th className="p-2 border-b">#</th>
                <th className="p-2 border-b">Foto</th>
                <th className="p-2 border-b">Nama</th>
                <th className="p-2 border-b">Repetisi</th>
                <th className="p-2 border-b">Durasi</th>
                <th className="p-2 border-b">Kategori</th>
                <th className="p-2 border-b">Catatan</th>
                <th className="p-2 border-b">Program</th>
                <th className="p-2 border-b text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {data.length > 0 ? (
                data.map((item, idx) => {
                  let fotoArr = [];
                  try {
                    fotoArr =
                      typeof item.foto === "string"
                        ? JSON.parse(item.foto)
                        : item.foto || [];
                  } catch (e) {
                    console.error("Invalid foto format");
                  }

                  return (
                    <tr key={item.id}>
                      <td className="p-2 border-b">{idx + 1}</td>
                      <td className="p-2 border-b">
                        {fotoArr.length > 0 ? (
                          <div className="flex gap-2 flex-wrap">
                            {fotoArr.map((img, i) => (
                              <img
                                key={i}
                                src={BASE_URL + img}
                                alt={`Foto ${i}`}
                                className="w-12 h-12 object-cover rounded cursor-pointer"
                                onClick={() =>
                                  setModalPreview({
                                    open: true,
                                    src: BASE_URL + img,
                                  })
                                }
                              />
                            ))}
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="p-2 border-b">{item.nama_detail}</td>
                      <td className="p-2 border-b">{item.repetisi || "-"}</td>
                      <td className="p-2 border-b">
                        {item.durasi ? `${item.durasi} menit` : "-"}
                      </td>
                      <td className="p-2 border-b capitalize">{item.kategori}</td>
                      <td className="p-2 border-b">{item.note || "-"}</td>
                      <td className="p-2 border-b">{item.program_latihan_id}</td>
                      <td className="p-2 border-b text-right space-x-2">
                        <Button size="sm" onClick={() => handleOpen(item)}>
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          color="red"
                          onClick={() => handleDelete(item.id)}
                        >
                          Hapus
                        </Button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={9} className="text-center py-4 text-gray-400">
                    Tidak ada detail latihan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardBody>
      </Card>

      <Dialog open={open} handler={handleClose}>
        <DialogHeader>
          {editId ? "Edit Detail Latihan" : "Tambah Detail Latihan"}
        </DialogHeader>

        <DialogBody className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
          <Select
            label="Pilih Program Latihan"
            value={programId}
            onChange={(val) => setProgramId(val)}
          >
            {programList.map((item) => (
              <Option key={item.id} value={item.id}>
                {item.nama}
              </Option>
            ))}
          </Select>

          <Input
            label="Nama Latihan"
            value={namaDetail}
            onChange={(e) => setNamaDetail(e.target.value)}
          />
          <Input
            type="number"
            label="Repetisi (opsional)"
            value={repetisi}
            onChange={(e) => setRepetisi(e.target.value)}
          />
          <Input
            type="number"
            label="Durasi (menit, opsional)"
            value={durasi}
            onChange={(e) => setDurasi(e.target.value)}
          />
          <Select
            label="Kategori"
            value={kategori}
            onChange={(val) => setKategori(val)}
          >
            <Option value="strength">Strength</Option>
            <Option value="cardio">Cardio</Option>
            <Option value="mobility">Mobility</Option>
          </Select>
          <textarea
            placeholder="Catatan tambahan (opsional)"
            className="w-full border rounded p-2 text-sm text-gray-700"
            rows={3}
            value={note}
            onChange={(e) => setNote(e.target.value)}
          ></textarea>
          <Input type="file" multiple label="Foto" onChange={handleFotoChange} />
          {preview.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {preview.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt={`Preview ${i}`}
                  className="w-24 h-24 object-cover rounded"
                />
              ))}
            </div>
          )}
        </DialogBody>

        <DialogFooter>
          <Button variant="text" color="gray" onClick={handleClose}>
            Batal
          </Button>
          <Button color="blue" onClick={handleSave}>
            Simpan
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Modal Preview */}
      <Dialog
        open={modalPreview.open}
        handler={() => setModalPreview({ open: false, src: "" })}
        size="xl"
      >
        <DialogBody className="p-4 flex justify-center">
          <img
            src={modalPreview.src}
            alt="Preview Besar"
            className="max-h-[80vh] object-contain"
          />
        </DialogBody>
      </Dialog>
    </div>
  );
};

export default DetailLatihan;
