"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { FloatingParticles } from "@/components/floating-particles"
import { GlassmorphicCard } from "@/components/glassmorphic-card"
import { AlertCircle, Download, Trash2, Users, BarChart, FileText } from "lucide-react"

type User = {
  id: number
  username: string
  email: string
  created_at: string
}

type Prediction = {
  id: number
  student_id: number
  username: string
  email: string
  attendance: number
  participation: number
  assignment: number
  prev_cgpa: number
  interest: number
  predicted_cgpa: number
  created_at: string
}

export default function AdminPage() {
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [userToDelete, setUserToDelete] = useState<User | null>(null)

  useEffect(() => {
    // Check if user is admin and fetch data
    const checkAdminAndFetchData = async () => {
      try {
        // In a real app, you would check if the user is admin
        // For demo purposes, we'll simulate this
        setIsAdmin(true)

        if (isAdmin) {
          // Fetch users
          const usersResponse = await fetch("/api/admin/users")
          if (!usersResponse.ok) {
            throw new Error("Failed to fetch users")
          }
          const usersData = await usersResponse.json()
          setUsers(usersData.users)

          // Fetch predictions
          const predictionsResponse = await fetch("/api/admin/predictions")
          if (!predictionsResponse.ok) {
            throw new Error("Failed to fetch predictions")
          }
          const predictionsData = await predictionsResponse.json()
          setPredictions(predictionsData.predictions)
        }
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    checkAdminAndFetchData()
  }, [isAdmin])

  const handleDeleteUser = async () => {
    if (!userToDelete) return

    try {
      const response = await fetch("/api/admin/users", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: userToDelete.id }),
      })

      if (!response.ok) {
        throw new Error("Failed to delete user")
      }

      // Remove user from list
      setUsers(users.filter((user) => user.id !== userToDelete.id))
      // Remove associated predictions
      setPredictions(predictions.filter((prediction) => prediction.student_id !== userToDelete.id))
      // Close dialog
      setUserToDelete(null)
    } catch (err: any) {
      setError(err.message)
    }
  }

  const downloadCSV = (data: any[], filename: string) => {
    // Convert data to CSV
    const headers = Object.keys(data[0]).join(",")
    const rows = data.map((item) => Object.values(item).join(","))
    const csv = [headers, ...rows].join("\n")

    // Create download link
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-950 via-indigo-900 to-purple-900 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-purple-200 text-lg">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-950 via-indigo-900 to-purple-900 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-center">Access Denied</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
            <p className="text-center mb-6">You do not have permission to access the admin dashboard.</p>
            <Button onClick={() => router.push("/")} className="w-full">
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-950 via-indigo-900 to-purple-900 py-20 px-4 sm:px-6 lg:px-8 relative">
      <div className="absolute inset-0 z-0">
        <FloatingParticles />
      </div>

      <div className="container mx-auto max-w-7xl z-10 relative">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h1 className="text-4xl font-bold text-white">Admin Dashboard</h1>
          <p className="mt-3 text-purple-200">Manage users and view prediction data</p>
        </motion.div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <GlassmorphicCard>
              <CardContent className="p-6 flex items-center">
                <div className="bg-purple-900/50 p-4 rounded-full mr-4">
                  <Users className="h-8 w-8 text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-purple-300">Total Users</p>
                  <h3 className="text-3xl font-bold text-white">{users.length}</h3>
                </div>
              </CardContent>
            </GlassmorphicCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <GlassmorphicCard>
              <CardContent className="p-6 flex items-center">
                <div className="bg-purple-900/50 p-4 rounded-full mr-4">
                  <BarChart className="h-8 w-8 text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-purple-300">Total Predictions</p>
                  <h3 className="text-3xl font-bold text-white">{predictions.length}</h3>
                </div>
              </CardContent>
            </GlassmorphicCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <GlassmorphicCard>
              <CardContent className="p-6 flex items-center">
                <div className="bg-purple-900/50 p-4 rounded-full mr-4">
                  <FileText className="h-8 w-8 text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-purple-300">Average CGPA</p>
                  <h3 className="text-3xl font-bold text-white">
                    {predictions.length > 0
                      ? (predictions.reduce((sum, p) => sum + p.predicted_cgpa, 0) / predictions.length).toFixed(2)
                      : "N/A"}
                  </h3>
                </div>
              </CardContent>
            </GlassmorphicCard>
          </motion.div>
        </div>

        <Tabs defaultValue="users" className="space-y-8">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 bg-black/40 border border-purple-500/20">
            <TabsTrigger value="users" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              Users
            </TabsTrigger>
            <TabsTrigger
              value="predictions"
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
            >
              Predictions
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <GlassmorphicCard>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-white">User Management</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => downloadCSV(users, "users.csv")}
                  className="flex items-center"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border border-purple-500/20 overflow-hidden">
                  <Table>
                    <TableHeader className="bg-purple-900/30">
                      <TableRow>
                        <TableHead className="text-purple-200">ID</TableHead>
                        <TableHead className="text-purple-200">Username</TableHead>
                        <TableHead className="text-purple-200">Email</TableHead>
                        <TableHead className="text-purple-200">Created At</TableHead>
                        <TableHead className="text-purple-200">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.length > 0 ? (
                        users.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell>{user.id}</TableCell>
                            <TableCell className="font-medium">{user.username}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setUserToDelete(user)}
                                className="text-red-500 hover:text-red-700 hover:bg-red-100/10"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-4">
                            No users found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </GlassmorphicCard>
          </TabsContent>

          <TabsContent value="predictions">
            <GlassmorphicCard>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-white">Prediction Data</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => downloadCSV(predictions, "predictions.csv")}
                  className="flex items-center"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border border-purple-500/20 overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-purple-900/30">
                      <TableRow>
                        <TableHead className="text-purple-200">ID</TableHead>
                        <TableHead className="text-purple-200">User</TableHead>
                        <TableHead className="text-purple-200">Attendance</TableHead>
                        <TableHead className="text-purple-200">Participation</TableHead>
                        <TableHead className="text-purple-200">Assignment</TableHead>
                        <TableHead className="text-purple-200">Previous CGPA</TableHead>
                        <TableHead className="text-purple-200">Interest</TableHead>
                        <TableHead className="text-purple-200">Predicted CGPA</TableHead>
                        <TableHead className="text-purple-200">Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {predictions.length > 0 ? (
                        predictions.map((prediction) => (
                          <TableRow key={prediction.id}>
                            <TableCell>{prediction.id}</TableCell>
                            <TableCell className="font-medium">{prediction.username}</TableCell>
                            <TableCell>{prediction.attendance}%</TableCell>
                            <TableCell>{prediction.participation}/10</TableCell>
                            <TableCell>{prediction.assignment ? "Yes" : "No"}</TableCell>
                            <TableCell>{prediction.prev_cgpa.toFixed(2)}</TableCell>
                            <TableCell>{prediction.interest}%</TableCell>
                            <TableCell className="font-medium">{prediction.predicted_cgpa.toFixed(2)}</TableCell>
                            <TableCell>{new Date(prediction.created_at).toLocaleDateString()}</TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={9} className="text-center py-4">
                            No predictions found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </GlassmorphicCard>
          </TabsContent>
        </Tabs>
      </div>

      {/* Delete User Dialog */}
      <Dialog open={!!userToDelete} onOpenChange={() => setUserToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p>
            Are you sure you want to delete user "{userToDelete?.username}"? This action cannot be undone and will
            remove all associated prediction data.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUserToDelete(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteUser}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
