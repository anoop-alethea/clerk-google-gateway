
import { useUser } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, FileText, Search } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Documentation = () => {
  const { user } = useUser();
  const [searchQuery, setSearchQuery] = useState("");

  // This would be fetched from your actual documentation source
  const documentationSections = [
    {
      id: "getting-started",
      title: "Getting Started",
      content: `
        <h2>Getting Started with Our Platform</h2>
        <p>Welcome to our documentation! This guide will help you get started with using our platform efficiently.</p>
        <h3>Prerequisites</h3>
        <ul>
          <li>A verified account (which you already have)</li>
          <li>Basic understanding of our platform's core concepts</li>
        </ul>
        <h3>First Steps</h3>
        <p>After logging in, we recommend exploring the dashboard features first. You can always return to this documentation for reference.</p>
      `
    },
    {
      id: "api-reference",
      title: "API Reference",
      content: `
        <h2>API Reference</h2>
        <p>Our API allows you to integrate our services with your existing systems.</p>
        <h3>Authentication</h3>
        <p>All API requests require authentication using OAuth 2.0.</p>
        <h3>Endpoints</h3>
        <p>Base URL: https://api.example.com/v1</p>
        <ul>
          <li><code>GET /users</code> - List all users</li>
          <li><code>POST /users</code> - Create a new user</li>
          <li><code>GET /users/{id}</code> - Get a specific user</li>
        </ul>
      `
    },
    {
      id: "faq",
      title: "FAQ",
      content: `
        <h2>Frequently Asked Questions</h2>
        <h3>How do I reset my password?</h3>
        <p>You can reset your password by clicking on the "Forgot Password" link on the login page.</p>
        <h3>Can I have multiple accounts?</h3>
        <p>No, our system currently supports one account per email address.</p>
        <h3>Is my data secure?</h3>
        <p>Yes, we employ industry-standard encryption and security practices to protect your data.</p>
      `
    }
  ];

  // Simple search filter
  const filteredSections = searchQuery 
    ? documentationSections.filter(section => 
        section.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        section.content.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : documentationSections;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6">
        <header className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <Link to="/">
              <Button variant="outline" size="sm">
                <ChevronLeft className="mr-1 h-4 w-4" /> Back to Dashboard
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">Documentation</h1>
          </div>
          <div className="text-sm text-gray-600">
            Welcome, {user?.fullName || user?.emailAddresses[0]?.emailAddress?.split('@')[0]}
          </div>
        </header>

        <div className="bg-white shadow rounded-lg">
          <div className="p-6 border-b">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Search documentation..."
                className="w-full pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <Tabs defaultValue="getting-started" className="w-full">
            <div className="border-b">
              <div className="px-6">
                <TabsList className="h-auto mt-2 bg-transparent border-b-0 p-0">
                  {documentationSections.map((section) => (
                    <TabsTrigger 
                      key={section.id}
                      value={section.id}
                      className="py-2 px-4 data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
                    >
                      {section.title}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
            </div>
            
            <div className="p-6">
              {filteredSections.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-lg font-medium">No results found</h3>
                  <p className="mt-1 text-gray-500">Try adjusting your search terms</p>
                </div>
              ) : (
                <>
                  {documentationSections.map((section) => (
                    <TabsContent key={section.id} value={section.id}>
                      <div 
                        className="prose max-w-none" 
                        dangerouslySetInnerHTML={{ __html: section.content }}
                      />
                    </TabsContent>
                  ))}
                </>
              )}
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Documentation;
