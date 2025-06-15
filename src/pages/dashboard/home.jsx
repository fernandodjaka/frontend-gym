import React from "react";
import {
  Typography,
  Card,
  CardHeader,
  CardBody,
  Avatar,
  Button,
  Progress,
  Tabs,
  TabsHeader,
  Tab,
  TabsBody,
  TabPanel
} from "@material-tailwind/react";
import {
  ClockIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  CalendarIcon,
  ArrowUpIcon,
  FireIcon,
  BoltIcon,
  HeartIcon
} from "@heroicons/react/24/solid";

const statisticsCardsData = [
  {
    color: "bg-gradient-to-r from-blue-500 to-blue-700",
    icon: UserGroupIcon,
    title: "Total Members",
    value: "1,248",
    footer: {
      color: "text-green-500",
      value: "+12%",
      label: "than last month"
    }
  },
  {
    color: "bg-gradient-to-r from-purple-500 to-purple-700",
    icon: CurrencyDollarIcon,
    title: "Revenue",
    value: "$34,680",
    footer: {
      color: "text-green-500",
      value: "+8%",
      label: "than last month"
    }
  },
  {
    color: "bg-gradient-to-r from-orange-500 to-orange-700",
    icon: FireIcon,
    title: "Active Now",
    value: "86",
    footer: {
      color: "text-red-500",
      value: "-3%",
      label: "than yesterday"
    }
  },
  {
    color: "bg-gradient-to-r from-green-500 to-green-700",
    icon: ChartBarIcon,
    title: "Avg. Attendance",
    value: "78%",
    footer: {
      color: "text-green-500",
      value: "+5%",
      label: "than last week"
    }
  }
];

const statisticsChartsData = [
  {
    color: "bg-blue-500",
    title: "Member Growth",
    description: "Monthly new members",
    chart: {
      type: "bar",
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
      datasets: [
        {
          label: "Members",
          data: [65, 59, 80, 81, 56, 55, 40]
        }
      ]
    },
    footer: "Updated 1 hour ago"
  },
  {
    color: "bg-purple-500",
    title: "Revenue Analysis",
    description: "Monthly revenue in $",
    chart: {
      type: "line",
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
      datasets: [
        {
          label: "Revenue",
          data: [3000, 4500, 2800, 8000, 9900, 4300, 7400]
        }
      ]
    },
    footer: "Updated 2 hours ago"
  }
];

const recentMembers = [
  {
    img: "/img/avatar1.jpg",
    name: "John Michael",
    email: "john@creative-tim.com",
    joinDate: "23/04/2023",
    membership: "Premium"
  },
  {
    img: "/img/avatar2.jpg",
    name: "Alexa Liras",
    email: "alexa@creative-tim.com",
    joinDate: "22/04/2023",
    membership: "Standard"
  },
  {
    img: "/img/avatar3.jpg",
    name: "Laurent Perrier",
    email: "laurent@creative-tim.com",
    joinDate: "20/04/2023",
    membership: "Premium"
  },
  {
    img: "/img/avatar4.jpg",
    name: "Michael Levi",
    email: "michael@creative-tim.com",
    joinDate: "18/04/2023",
    membership: "Standard"
  },
  {
    img: "/img/avatar5.jpg",
    name: "Richard Gran",
    email: "richard@creative-tim.com",
    joinDate: "16/04/2023",
    membership: "Premium"
  }
];

const popularClasses = [
  {
    name: "HIIT Burn",
    instructor: "Emma Wilson",
    attendance: 45,
    capacity: 50,
    icon: BoltIcon
  },
  {
    name: "Yoga Flow",
    instructor: "Michael Stone",
    attendance: 38,
    capacity: 40,
    icon: HeartIcon
  },
  {
    name: "Power Lifting",
    instructor: "Alex Smith",
    attendance: 28,
    capacity: 30,
    icon: FireIcon
  }
];

export function Home() {
  return (
    <div className="px-4 py-6 md:px-8">
      {/* Header */}
      <div className="mb-8">
        <Typography variant="h3" color="blue-gray" className="font-bold">
          Dashboard Overview
        </Typography>
        <Typography variant="paragraph" color="gray" className="mt-1">
          Welcome back, Admin! Here's what's happening with your gym today.
        </Typography>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
        {statisticsCardsData.map(({ color, icon, title, value, footer }) => (
          <Card key={title} className="shadow-sm border border-blue-gray-50">
            <CardBody className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <Typography variant="small" color="blue-gray" className="font-normal">
                    {title}
                  </Typography>
                  <Typography variant="h4" color="blue-gray" className="mt-1">
                    {value}
                  </Typography>
                </div>
                <div className={`${color} p-3 rounded-lg shadow-md`}>
                  {React.createElement(icon, {
                    className: "w-6 h-6 text-white",
                  })}
                </div>
              </div>
              <div className="mt-4 pt-2 border-t border-blue-gray-50">
                <Typography variant="small" className="flex items-center gap-1">
                  <span className={footer.color}>{footer.value}</span>
                  <span className="text-blue-gray-600">{footer.label}</span>
                </Typography>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Charts and Main Content */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Member Growth Chart */}
        <Card className="lg:col-span-2 shadow-sm border border-blue-gray-50">
          <CardHeader
            floated={false}
            shadow={false}
            className="p-4 border-b border-blue-gray-50"
          >
            <Typography variant="h5" color="blue-gray">
              Member Growth
            </Typography>
            <Typography variant="small" color="gray" className="mt-1">
              Monthly new members registration
            </Typography>
          </CardHeader>
          <CardBody className="p-4">
            <div className="h-64">
              {/* Chart would be rendered here */}
              <div className="w-full h-full bg-gray-100 rounded flex items-center justify-center">
                <Typography color="gray">Member Growth Chart</Typography>
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <ClockIcon className="w-4 h-4 text-blue-gray-400 mr-1" />
              <Typography variant="small" color="blue-gray" className="font-normal">
                Updated 1 hour ago
              </Typography>
            </div>
          </CardBody>
        </Card>

        {/* Recent Members */}
        <Card className="shadow-sm border border-blue-gray-50">
          <CardHeader
            floated={false}
            shadow={false}
            className="p-4 border-b border-blue-gray-50"
          >
            <Typography variant="h5" color="blue-gray">
              Recent Members
            </Typography>
            <Typography variant="small" color="gray" className="mt-1">
              Newest gym members
            </Typography>
          </CardHeader>
          <CardBody className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full min-w-max table-auto">
                <tbody>
                  {recentMembers.map(({ img, name, email, joinDate, membership }, index) => (
                    <tr key={name} className="border-b border-blue-gray-50 last:border-b-0">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <Avatar src={img} alt={name} size="sm" />
                          <div>
                            <Typography variant="small" color="blue-gray" className="font-semibold">
                              {name}
                            </Typography>
                            <Typography variant="small" color="gray" className="font-normal">
                              {email}
                            </Typography>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <Typography variant="small" color="blue-gray" className="font-normal">
                          {joinDate}
                        </Typography>
                      </td>
                      <td className="p-4">
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                          membership === "Premium" 
                            ? "bg-purple-100 text-purple-800" 
                            : "bg-blue-100 text-blue-800"
                        }`}>
                          {membership}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 gap-6 mt-6 lg:grid-cols-2">
        {/* Popular Classes */}
        <Card className="shadow-sm border border-blue-gray-50">
          <CardHeader
            floated={false}
            shadow={false}
            className="p-4 border-b border-blue-gray-50"
          >
            <Typography variant="h5" color="blue-gray">
              Popular Classes
            </Typography>
            <Typography variant="small" color="gray" className="mt-1">
              Most attended classes this week
            </Typography>
          </CardHeader>
          <CardBody className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full min-w-max table-auto">
                <tbody>
                  {popularClasses.map(({ name, instructor, attendance, capacity, icon }) => (
                    <tr key={name} className="border-b border-blue-gray-50 last:border-b-0">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            {React.createElement(icon, {
                              className: "w-5 h-5 text-blue-700",
                            })}
                          </div>
                          <div>
                            <Typography variant="small" color="blue-gray" className="font-semibold">
                              {name}
                            </Typography>
                            <Typography variant="small" color="gray" className="font-normal">
                              {instructor}
                            </Typography>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Progress 
                            value={(attendance / capacity) * 100} 
                            size="sm" 
                            color="green" 
                          />
                          <Typography variant="small" color="blue-gray" className="font-medium">
                            {attendance}/{capacity}
                          </Typography>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardBody>
        </Card>

        {/* Revenue Analysis */}
        <Card className="shadow-sm border border-blue-gray-50">
          <CardHeader
            floated={false}
            shadow={false}
            className="p-4 border-b border-blue-gray-50"
          >
            <Typography variant="h5" color="blue-gray">
              Revenue Analysis
            </Typography>
            <Typography variant="small" color="gray" className="mt-1">
              Monthly revenue in $
            </Typography>
          </CardHeader>
          <CardBody className="p-4">
            <div className="h-64">
              {/* Chart would be rendered here */}
              <div className="w-full h-full bg-gray-100 rounded flex items-center justify-center">
                <Typography color="gray">Revenue Analysis Chart</Typography>
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <ClockIcon className="w-4 h-4 text-blue-gray-400 mr-1" />
              <Typography variant="small" color="blue-gray" className="font-normal">
                Updated 2 hours ago
              </Typography>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

export default Home;