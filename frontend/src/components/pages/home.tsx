import { useCountDailysWithStatusCompleted, useCountDailysWithStatusInProgress, useCountDailysWithStatusNew, useCountSubTasksWithStatusCompleted, useCountSubTasksWithStatusInProgress, useCountSubTasksWithStatusNew } from "@/lib/queries";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "../ui/card";
import { motion } from 'framer-motion'
import { Loader, RefreshCcw } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, Cell, Pie, PieChart, XAxis, YAxis } from "recharts";

const Home = () => {
  const queryClient = useQueryClient();

  const { data: dailysCountStatusNew = 0, isFetching } = useCountDailysWithStatusNew()
  const { data: dailysCountStatusInProgress = 0, isFetching: isFetchingDailyProgress } = useCountDailysWithStatusInProgress()
  const { data: dailysCountStatusCompleted = 0, isFetching: isFetchingDailyCompleted } = useCountDailysWithStatusCompleted()
  const { data: subTaskCountStatusNew = 0, isFetching: isFetchingSubTasksNew } = useCountSubTasksWithStatusNew()
  const { data: subTaskCountStatusInProgress = 0, isFetching: isFetchingSubTasksProgress } = useCountSubTasksWithStatusInProgress()
  const { data: subTaskCountStatusCompleted = 0, isFetching: isFetchingSubTasksCompleted } = useCountSubTasksWithStatusCompleted()

  const chartData = [
    { name: "New", value: dailysCountStatusNew, fill: "var(--chart-3)" },
    { name: "In \n Progress", value: dailysCountStatusInProgress, fill: "var(--chart-1)" },
    { name: "Completed", value: dailysCountStatusCompleted, fill: "var(--chart-2)" },
  ];

  const barChartData = [
    { status: "New", count: dailysCountStatusNew },
    { status: "In \n Progress", count: dailysCountStatusInProgress },
    { status: "Completed", count: dailysCountStatusCompleted },
  ];

  const subTasksChartData = [
    { name: "New", value: subTaskCountStatusNew, fill: "var(--chart-5)" },
    { name: "In \n Progress", value: subTaskCountStatusInProgress, fill: "var(--chart-1)" },
    { name: "Completed", value: subTaskCountStatusCompleted, fill: "var(--chart-2)" },
  ];

  const subTasksBarChartData = [
    { status: "New", count: subTaskCountStatusNew },
    { status: "In \n Progress", count: subTaskCountStatusInProgress },
    { status: "Completed", count: subTaskCountStatusCompleted },
  ];

  const chartConfig = {
    new: {
      label: "New",
      color: "var(--chart-1)",
    },
    inProgress: {
      label: "In Progress",
      color: "var(--chart-2)",
    },
    completed: {
      label: "Completed",
      color: "var(--chart-3)",
    },
  };

  return (
    <div className="w-full p-4 flex flex-col gap-4 max-h-[90dvh] overflow-y-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Dailys Status Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[30dvh] w-full">
                <BarChart data={barChartData}>
                  <XAxis dataKey="status" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="count" radius={8}>
                    {barChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={chartData[index].fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Dailys Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[30dvh] w-full">
                <PieChart>
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    label
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                </PieChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Dailys stats</CardTitle>
              <CardAction onClick={() => queryClient.invalidateQueries({ queryKey: ['countDailysWithStatusNew'] })}>
                {isFetching ? <Loader className="w-4 h-4 animate-spin" /> : <RefreshCcw className="cursor-pointer w-4 h-4" />}
              </CardAction>
            </CardHeader>
            <CardContent>
              <p>Dailys with status New: {dailysCountStatusNew}</p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Dailys stats</CardTitle>
              <CardAction onClick={() => queryClient.invalidateQueries({ queryKey: ['countDailysWithStatusInProgress'] })}>
                {isFetchingDailyProgress ? <Loader className="w-4 h-4 animate-spin" /> : <RefreshCcw className="cursor-pointer w-4 h-4" />}
              </CardAction>
            </CardHeader>
            <CardContent>
              <p>Dailys with status In Progress: {dailysCountStatusInProgress}</p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Dailys stats</CardTitle>
              <CardAction onClick={() => queryClient.invalidateQueries({ queryKey: ['countDailysWithStatusCompleted'] })}>
                {isFetchingDailyCompleted ? <Loader className="w-4 h-4 animate-spin" /> : <RefreshCcw className="cursor-pointer w-4 h-4" />}
              </CardAction>
            </CardHeader>
            <CardContent>
              <p>Dailys with status Completed: {dailysCountStatusCompleted}</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Sub Tasks Status Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[30dvh] w-full">
                <BarChart data={subTasksBarChartData}>
                  <XAxis dataKey="status" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="count" radius={8}>
                    {subTasksBarChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={chartData[index].fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Sub Tasks Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[30dvh] w-full">
                <PieChart>
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Pie
                    data={subTasksChartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    label
                  >
                    {subTasksChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                </PieChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Sub tasks stats</CardTitle>
              <CardAction onClick={() => queryClient.invalidateQueries({ queryKey: ['countSubTasksWithStatusNew'] })}>
                {isFetchingSubTasksNew ? <Loader className="w-4 h-4 animate-spin" /> : <RefreshCcw className="cursor-pointer w-4 h-4" />}
              </CardAction>
            </CardHeader>
            <CardContent>
              <p>SubTasks with status New: {subTaskCountStatusNew}</p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>SubTasks stats</CardTitle>
              <CardAction onClick={() => queryClient.invalidateQueries({ queryKey: ['countSubTasksWithStatusInProgress'] })}>
                {isFetchingSubTasksProgress ? <Loader className="w-4 h-4 animate-spin" /> : <RefreshCcw className="cursor-pointer w-4 h-4" />}
              </CardAction>
            </CardHeader>
            <CardContent>
              <p>SubTasks with status In Progress: {subTaskCountStatusInProgress}</p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>SubTasks stats</CardTitle>
              <CardAction onClick={() => queryClient.invalidateQueries({ queryKey: ['countSubTasksWithStatusCompleted'] })}>
                {isFetchingSubTasksCompleted ? <Loader className="w-4 h-4 animate-spin" /> : <RefreshCcw className="cursor-pointer w-4 h-4" />}
              </CardAction>
            </CardHeader>
            <CardContent>
              <p>SubTasks with status Completed: {subTaskCountStatusCompleted}</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

export default Home