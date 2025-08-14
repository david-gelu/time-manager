import TableComponent from "@/components/table/table"

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full pt-5 bg-sidebar">
      <h1 className="text-2xl font-bold mb-4">Home Page</h1>
      <TableComponent />
    </div>
  )
}

export default Home