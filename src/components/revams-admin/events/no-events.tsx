import { Plus } from "lucide-react";

export default function NoEvents({ fromParams }: { fromParams?: boolean }) {
  const getSubtitle = () => {
    if (fromParams)
      return "Unfortunately, no events matched your search or filter";
    else return "Add your first event to get started";
  };

  return (
    <div className="bg-secondary/12 p-10 rounded-lg text-center">
      <h3 className="font-semibold text-base text-primary">No events found</h3>
      <p className="text-sm text-muted-foreground mb-10">{getSubtitle()}</p>
      {!fromParams && (
        <button className="h-10 w-10 rounded-full bg-accent flex items-center justify-center mx-auto">
          <Plus size={20} className="text-accent-foreground" />
        </button>
      )}
    </div>
  );
}
