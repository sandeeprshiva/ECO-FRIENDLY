"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TestPage() {
  const [backendStatus, setBackendStatus] = useState("Testing...")
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)

  const testBackend = async () => {
    try {
      setLoading(true)
      const response = await fetch('http://localhost:3001/health')
      const data = await response.json()
      setBackendStatus(`✅ Backend Connected: ${data.status}`)
    } catch (error) {
      setBackendStatus(`❌ Backend Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const testItemsAPI = async () => {
    try {
      setLoading(true)
      const response = await fetch('http://localhost:3001/api/items')
      const data = await response.json()
      setItems(data.items || [])
    } catch (error) {
      console.error('Items API Error:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    testBackend()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">EcoFriend API Test</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Backend Connection Test</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">{backendStatus}</p>
            <Button onClick={testBackend} disabled={loading}>
              {loading ? "Testing..." : "Test Backend"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Items API Test</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={testItemsAPI} disabled={loading} className="mb-4">
              {loading ? "Loading..." : "Test Items API"}
            </Button>
            <div className="space-y-2">
              <p>Items found: {items.length}</p>
              {items.length > 0 && (
                <div className="bg-gray-100 p-4 rounded">
                  <pre>{JSON.stringify(items, null, 2)}</pre>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Frontend Status</CardTitle>
          </CardHeader>
          <CardContent>
            <p>✅ Frontend is running on Next.js</p>
            <p>✅ React components are working</p>
            <p>✅ UI components are loaded</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
