import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import Link from "next/link";

type props = {
  limit: string;
  feature: string;
  open: boolean;
  onOpenChange: () => void;
};

export default function LimitedFeature({
  limit,
  feature,
  open,
  onOpenChange,
}: props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-xl border-none shadow-[0px_20px_207px_10px] shadow-secondary/40">
        <DialogHeader>
          <DialogTitle>Upgrade to Supernova</DialogTitle>
          <DialogDescription>
            You&apos;ve reached your limit of{" "}
            <span className="text-secondary">{limit}</span>. Upgrade to
            Supernova to have{" "}
            <span className="text-secondary">unlimited {feature}</span>.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div>
            <Label htmlFor="name" className="text-right">
              Coming soon...
            </Label>
          </div>
        </div>
        <DialogFooter className="flex w-full items-end justify-center gap-2">
          <DialogClose asChild>
            <Button className="w-fit gap-2 border-[1px] border-muted bg-background font-sans text-sm text-foreground transition-colors hover:border-secondary hover:bg-secondary-smooth-700/10 hover:text-secondary md:text-sm">
              Not now
            </Button>
          </DialogClose>

          <Button
            asChild
            className="w-fit gap-2 border-[1px] border-transparent bg-gradient-to-r from-secondary via-secondary-smooth-400 to-secondary-smooth-500 font-sans text-sm text-background transition-all hover:bg-secondary-smooth-700/10 hover:brightness-110"
          >
            <Link href="/pricing">Upgrade</Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
