
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import SermonAudioManager from '@/components/admin/SermonAudioManager';
import SermonManager from '@/components/media/SermonManager';
import SubscriberManager from '@/components/admin/SubscriberManager';
import DatabaseMonitor from '@/components/admin/DatabaseMonitor';
import EmailTestPanel from '@/components/admin/EmailTestPanel';
import KioskManager from '@/components/admin/KioskManager';
import BankingQRManager from '@/components/admin/BankingQRManager';
import RegistrationManager from '@/components/admin/RegistrationManager';
import QAManager from '@/components/admin/QAManager';
import PledgeManager from '@/components/admin/PledgeManager';
import InviteRegistrantsButton from '@/components/admin/InviteRegistrantsButton';
import AdminGate from '@/components/admin/AdminGate';

const Admin = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const adminSections = [
    { id: "overview", label: "Overview", icon: "📊" },
    { id: "registrations", label: "Registrations", icon: "📝" },
    { id: "invitations", label: "Invitations", icon: "✉️" },
    { id: "pledges", label: "Pledges", icon: "🙏" },
    { id: "qa", label: "Live Q&A", icon: "❓" },
    { id: "sermons", label: "Sermons", icon: "🎵" },
    { id: "subscribers", label: "Subscribers", icon: "👥" },
    { id: "database", label: "Database", icon: "💾" },
    { id: "email", label: "Email Test", icon: "📧" },
    { id: "kiosk", label: "Kiosk", icon: "🖥️" },
    { id: "banking", label: "Banking QR", icon: "💳" }
  ];

  return (
    <AdminGate>
    <Layout>
      <main className="flex-grow pt-24 page-transition">
        <section className="bg-gradient-to-b from-church-blue-light to-white py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <span className="inline-block bg-white px-3 py-1 rounded-full text-sm font-medium text-church-neutral-700 mb-4 shadow-sm">
                Administration
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-church-neutral-900 mb-6">
                Admin Dashboard
              </h1>
              <p className="text-lg text-church-neutral-700">
                Manage church content, monitor systems, and configure settings.
              </p>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-5 lg:grid-cols-11 mb-8">
                {adminSections.map((section) => (
                  <TabsTrigger key={section.id} value={section.id} className="text-xs">
                    <span className="mr-1">{section.icon}</span>
                    <span className="hidden sm:inline">{section.label}</span>
                  </TabsTrigger>
                ))}
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {adminSections.slice(1).map((section) => (
                    <Card key={section.id} className="cursor-pointer hover:shadow-lg transition-shadow"
                          onClick={() => setActiveTab(section.id)}>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <span className="text-2xl mr-2">{section.icon}</span>
                          {section.label}
                        </CardTitle>
                        <CardDescription>
                          {section.id === 'registrations' && 'View and manage event registrations with location details'}
                          {section.id === 'invitations' && 'Send invitations to previous registrants for upcoming events'}
                          {section.id === 'pledges' && 'Manage pledges for the Apostolic Conference Malawi 2026'}
                          {section.id === 'qa' && 'Manage live Q&A questions for conferences and events'}
                          {section.id === 'sermons' && 'Upload and manage sermon audio files and YouTube videos'}
                          {section.id === 'subscribers' && 'Manage newsletter subscribers'}
                          {section.id === 'database' && 'Monitor database connections'}
                          {section.id === 'email' && 'Test email functionality'}
                          {section.id === 'kiosk' && 'Configure kiosk check-in system'}
                          {section.id === 'banking' && 'Generate banking QR codes'}
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="registrations">
                <RegistrationManager />
              </TabsContent>

              <TabsContent value="invitations">
                <InviteRegistrantsButton />
              </TabsContent>

              <TabsContent value="pledges">
                <PledgeManager />
              </TabsContent>

              <TabsContent value="qa">
                <QAManager />
              </TabsContent>

              <TabsContent value="sermons">
                <div className="space-y-8">
                  <Card>
                    <CardHeader>
                      <CardTitle>Sermon Library</CardTitle>
                      <CardDescription>Update sermon details, YouTube links, and metadata.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <SermonManager />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Audio Uploads (Storage)</CardTitle>
                      <CardDescription>Manage raw sermon audio files stored in Supabase.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <SermonAudioManager />
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="subscribers">
                <SubscriberManager />
              </TabsContent>

              <TabsContent value="database">
                <DatabaseMonitor />
              </TabsContent>

              <TabsContent value="email">
                <EmailTestPanel />
              </TabsContent>

              <TabsContent value="kiosk">
                <KioskManager />
              </TabsContent>

              <TabsContent value="banking">
                <BankingQRManager />
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>
    </Layout>
    </AdminGate>
  );
};

export default Admin;
