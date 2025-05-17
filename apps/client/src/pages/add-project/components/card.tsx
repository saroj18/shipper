import { Button } from "@/components/ui/button";

const Card = () => {
  return (
    <div className="flex items-center justify-between p-4 border-2 bg-neutral-900 rounded-md my-3">
      <div className="flex items-center gap-4">
        <p className="font-semibold">blog_app</p>
        <p className="text-neutral-400">Apr 22</p>
      </div>
      <Button variant={'secondary'}>Import</Button>
    </div>
  );
}

export default Card
