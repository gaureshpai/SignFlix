'use client' 
 
import { Button } from '@/components/ui/button';
import { Loader } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react'

 
export default function Error({
  reset }: {  reset: () => void}) {
 const [isPending, startTransition] = useTransition();
 const router = useRouter();
 
  return (
    <div>
      <h2>Something went wrong!</h2>
      <Button
      disabled={isPending}
        onClick={() => {
          startTransition(() => {
            router.refresh();
            reset();
          });
        }}
      >
        {isPending && <Loader/>}
        Try again
      </Button>
    </div>
  )
}