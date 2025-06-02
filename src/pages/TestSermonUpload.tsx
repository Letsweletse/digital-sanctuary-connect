
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useSermonAudioUpload } from '@/hooks/useSermonAudioUpload';
import SermonAudioUpload from '@/components/media/form-fields/SermonAudioUpload';
import { useDualSermons } from '@/hooks/useDualSermons';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Upload, Database } from 'lucide-react';

const TestSermonUpload = () => {
  const {
    audioFile,
    setAudioFile,
    audioUrl,
    setAudioUrl,
    isUploading,
    uploadProgress,
    uploadError,
    handleAudioUpload,
    resetUpload,
    getFormattedDuration,
    getFormattedFileSize
  } = useSermonAudioUpload();

  const { addSermon, sermons, activeProvider } = useDualSermons();

  const handleTestUpload = async () => {
    if (!audioFile) return;
    
    const success = await handleAudioUpload(audioFile, 'sermons');
    
    if (success && audioUrl) {
      // Add a test sermon to the database
      try {
        await addSermon({
          title: `Test Audio Upload - ${audioFile.name}`,
          speaker: 'Test Speaker',
          date: new Date(),
          audioUrl: audioUrl,
          description: 'This is a test sermon uploaded to verify Supabase audio functionality.',
          tags: ['test', 'upload'],
          duration: getFormattedDuration(),
        });
        
        console.log('Test sermon added successfully to database');
      } catch (error) {
        console.error('Error adding test sermon to database:', error);
      }
    }
  };

  return (
    <Layout>
      <main className="flex-grow py-10 md:py-16 bg-church-neutral-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-6 w-6 text-church-blue" />
                Supabase Sermon Audio Upload Test
              </CardTitle>
              <div className="flex items-center gap-4">
                <Badge variant="outline" className="flex items-center gap-1">
                  <Database className="h-3 w-3" />
                  Provider: {activeProvider}
                </Badge>
                <Badge variant="outline">
                  Total Sermons: {sermons.length}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Test Status */}
              <div className="bg-church-blue-light/10 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Test Instructions:</h3>
                <ol className="list-decimal list-inside space-y-1 text-sm">
                  <li>Upload an audio file (MP3, WAV, M4A, or OGG)</li>
                  <li>Monitor the upload progress</li>
                  <li>Verify the file is stored in Supabase</li>
                  <li>Check if a test sermon entry is created in the database</li>
                </ol>
              </div>

              {/* Upload Component */}
              <SermonAudioUpload
                audioFile={audioFile}
                setAudioFile={setAudioFile}
                handleAudioUpload={handleAudioUpload}
                audioUrl={audioUrl}
                setAudioUrl={setAudioUrl}
                isUploading={isUploading}
                uploadProgress={uploadProgress}
                uploadError={uploadError}
                sermonTitle="Test Audio Upload"
                speakerName="Test Speaker"
              />

              {/* Test Results */}
              {audioUrl && (
                <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <h3 className="font-semibold text-green-800">Upload Successful!</h3>
                  </div>
                  <div className="space-y-2 text-sm">
                    <p><strong>File:</strong> {audioFile?.name}</p>
                    <p><strong>Size:</strong> {getFormattedFileSize()}</p>
                    <p><strong>Duration:</strong> {getFormattedDuration()}</p>
                    <p><strong>Supabase URL:</strong> <code className="text-xs bg-gray-100 px-1 rounded">{audioUrl}</code></p>
                  </div>
                  
                  <div className="mt-4 space-x-2">
                    <Button onClick={handleTestUpload} size="sm">
                      Add Test Sermon to Database
                    </Button>
                    <Button onClick={resetUpload} variant="outline" size="sm">
                      Reset Test
                    </Button>
                  </div>
                </div>
              )}

              {uploadError && (
                <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <XCircle className="h-5 w-5 text-red-600" />
                    <h3 className="font-semibold text-red-800">Upload Failed</h3>
                  </div>
                  <p className="text-sm text-red-700">{uploadError}</p>
                  <Button onClick={resetUpload} variant="outline" size="sm" className="mt-2">
                    Try Again
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Sermons Display */}
          {sermons.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Recent Sermons in Database</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {sermons.slice(0, 5).map((sermon) => (
                    <div key={sermon.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <div>
                        <p className="font-medium">{sermon.title}</p>
                        <p className="text-sm text-gray-600">{sermon.speaker}</p>
                      </div>
                      <div className="text-right">
                        {sermon.audioUrl && (
                          <Badge variant="secondary" className="text-xs">
                            Has Audio
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </Layout>
  );
};

export default TestSermonUpload;
