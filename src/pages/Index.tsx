import { useState, useEffect, useRef } from "react";
import { Play, Pause, SkipForward, Trash2, Plus, Music } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

interface Track {
  id: string;
  title: string;
  duration: number;
}

export default function Index() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playlistUrl, setPlaylistUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Load tracks from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("aqeelbd_tracks");
    if (saved) {
      setTracks(JSON.parse(saved));
    }
  }, []);

  // Save tracks to localStorage
  useEffect(() => {
    localStorage.setItem("aqeelbd_tracks", JSON.stringify(tracks));
  }, [tracks]);

  // Handle autoplay next track
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => {
      if (currentTrackIndex < tracks.length - 1) {
        setCurrentTrackIndex(currentTrackIndex + 1);
        setIsPlaying(true);
      } else {
        setIsPlaying(false);
      }
    };

    audio.addEventListener("ended", handleEnded);
    return () => audio.removeEventListener("ended", handleEnded);
  }, [currentTrackIndex, tracks.length]);

  // Play/pause effect
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.play().catch(() => setIsPlaying(false));
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  // Extract playlist ID from YouTube URL
  const extractPlaylistId = (url: string): string | null => {
    const regex = /[?&]list=([a-zA-Z0-9_-]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  // Mock YouTube playlist parser (client-side simulation)
  const parseYouTubePlaylist = async (url: string) => {
    const playlistId = extractPlaylistId(url);
    if (!playlistId) {
      alert("Invalid YouTube playlist URL");
      return;
    }

    setLoading(true);
    try {
      // Simulate playlist data with sample tracks
      const mockTracks: Track[] = [
        {
          id: "1",
          title: "Sample Track 1 - Aqeelbd Music",
          duration: 240,
        },
        {
          id: "2",
          title: "Sample Track 2 - Aqeelbd Music",
          duration: 180,
        },
        {
          id: "3",
          title: "Sample Track 3 - Aqeelbd Music",
          duration: 200,
        },
      ];

      // In production, you would fetch actual playlist data
      // For now, we'll use mock data
      setTracks((prev) => [...prev, ...mockTracks]);
      setPlaylistUrl("");
    } catch (error) {
      console.error("Error parsing playlist:", error);
      alert("Failed to parse playlist");
    } finally {
      setLoading(false);
    }
  };

  const handleAddPlaylist = () => {
    if (playlistUrl.trim()) {
      parseYouTubePlaylist(playlistUrl);
    }
  };

  const handleRemoveTrack = (index: number) => {
    const newTracks = tracks.filter((_, i) => i !== index);
    setTracks(newTracks);
    if (currentTrackIndex >= newTracks.length) {
      setCurrentTrackIndex(Math.max(0, newTracks.length - 1));
    }
  };

  const handleClearAll = () => {
    if (confirm("Clear all tracks?")) {
      setTracks([]);
      setCurrentTrackIndex(0);
      setIsPlaying(false);
    }
  };

  const currentTrack = tracks[currentTrackIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 pt-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Music className="w-10 h-10 text-purple-400" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              aqeelbd
            </h1>
          </div>
          <p className="text-slate-400">Online Audio Player</p>
        </div>

        {/* Playlist Input */}
        <Card className="bg-slate-800 border-slate-700 p-6 mb-6">
          <label className="block text-sm font-medium mb-3 text-slate-300">
            Add YouTube Playlist
          </label>
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Paste YouTube playlist URL..."
              value={playlistUrl}
              onChange={(e) => setPlaylistUrl(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleAddPlaylist()}
              className="bg-slate-700 border-slate-600 text-white placeholder-slate-500"
            />
            <Button
              onClick={handleAddPlaylist}
              disabled={loading}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </Card>

        {/* Player Display */}
        {currentTrack && (
          <Card className="bg-gradient-to-b from-slate-800 to-slate-900 border-purple-500/50 p-8 mb-6">
            <div className="text-center mb-8">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Music className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-2">{currentTrack.title}</h2>
              <p className="text-slate-400">
                Track {currentTrackIndex + 1} of {tracks.length}
              </p>
            </div>

            {/* Controls */}
            <div className="flex justify-center gap-6 mb-6">
              <Button
                onClick={() => setIsPlaying(!isPlaying)}
                size="lg"
                className="bg-purple-600 hover:bg-purple-700 w-16 h-16 rounded-full"
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6" />
                ) : (
                  <Play className="w-6 h-6" />
                )}
              </Button>
              <Button
                onClick={() => {
                  if (currentTrackIndex < tracks.length - 1) {
                    setCurrentTrackIndex(currentTrackIndex + 1);
                    setIsPlaying(true);
                  }
                }}
                size="lg"
                className="bg-slate-700 hover:bg-slate-600 w-16 h-16 rounded-full"
              >
                <SkipForward className="w-6 h-6" />
              </Button>
            </div>

            {/* Hidden Audio Element */}
            <audio
              ref={audioRef}
              src={`https://www.youtube.com/watch?v=${currentTrack.id}`}
              crossOrigin="anonymous"
            />
          </Card>
        )}

        {/* Playlist */}
        <Card className="bg-slate-800 border-slate-700 p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">
              Playlist ({tracks.length} tracks)
            </h3>
            {tracks.length > 0 && (
              <Button
                onClick={handleClearAll}
                variant="ghost"
                size="sm"
                className="text-red-400 hover:text-red-300 hover:bg-red-950"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear All
              </Button>
            )}
          </div>

          {tracks.length === 0 ? (
            <p className="text-slate-400 text-center py-8">
              No tracks yet. Add a YouTube playlist to get started!
            </p>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {tracks.map((track, index) => (
                <div
                  key={track.id}
                  onClick={() => {
                    setCurrentTrackIndex(index);
                    setIsPlaying(true);
                  }}
                  className={`p-3 rounded-lg cursor-pointer transition-colors flex justify-between items-center ${
                    index === currentTrackIndex
                      ? "bg-purple-600"
                      : "bg-slate-700 hover:bg-slate-600"
                  }`}
                >
                  <span className="flex-1 truncate">{track.title}</span>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveTrack(index);
                    }}
                    variant="ghost"
                    size="sm"
                    className="text-red-400 hover:text-red-300 hover:bg-red-950"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-slate-500 text-sm">
          <p>Saved tracks are persistent across sessions</p>
        </div>
      </div>
    </div>
  );
}
