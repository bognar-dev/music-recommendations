"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PlayButton } from "./play-button"
import Image from "next/image";
import { Song } from "@/db/schema";
import { useTranslations } from "next-intl";


interface PlaylistProps {
  playlist: Song[]
  className?: string
}


export default function Playlist({ playlist, className }: PlaylistProps) {
  const t = useTranslations('Playlist');
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{t('curatedPlaylist')}</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {playlist.map((track) => (
            <li key={track.id} className="flex items-center space-x-4 border-b pb-4 last:border-b-0">
              <Image
                 src={track.image_url && track.image_url !== "no" ? track.image_url : '/placeholder.svg'}
                alt={`${track.name} album cover`}
                className="h-16 w-16 rounded"
                width={64}
                height={64}
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{track.name}</p>
                    <p className="text-sm text-muted-foreground">{track.artist}</p>
                  </div>
                 <PlayButton song={track}/>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
