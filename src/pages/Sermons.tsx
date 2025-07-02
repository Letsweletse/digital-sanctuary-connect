
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Construction } from 'lucide-react';

const Sermons = () => {
  return (
    <Layout>
      <main className="flex-grow pt-24 page-transition">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-church-neutral-900 mb-4">Sermons</h1>
            <p className="text-lg text-church-neutral-600">
              Listen to inspiring messages from our church services
            </p>
          </div>
          
          <section className="py-16">
            <div className="container mx-auto px-4">
              <Card className="max-w-2xl mx-auto">
                <CardContent className="text-center py-12">
                  <Construction className="w-16 h-16 text-church-blue mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Still Working on Sermons</h3>
                  <p className="text-muted-foreground mb-6">
                    We're currently setting up the sermons section. Check back soon for inspiring messages and teachings!
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>
        </div>
      </main>
    </Layout>
  );
};

export default Sermons;
