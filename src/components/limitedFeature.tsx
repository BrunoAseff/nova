import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "./ui/label";
import { Button } from "./ui/button";

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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upgrade to Supernova</DialogTitle>
          <DialogDescription>
            You&apos;ve reached your limit of {limit}. Upgrade to Supernova to
            have unlimited {feature}.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div>
            <Label htmlFor="name" className="text-right">
              image here soon
            </Label>
          </div>
        </div>
        <DialogFooter className="">
          <Button className="w-fit gap-2 rounded-xl border-[1px] border-muted bg-muted p-3 font-sans text-sm font-[600] text-foreground transition-colors hover:border-secondary hover:bg-secondary-smooth-700/10 hover:text-secondary">
            Not now
          </Button>

          <Button className="w-fit gap-2 rounded-xl border-[1px] bg-foreground p-3 font-sans text-sm font-[600] text-background transition-colors hover:border-destructive hover:bg-red-700/10 hover:text-destructive">
            Upgrade!
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
