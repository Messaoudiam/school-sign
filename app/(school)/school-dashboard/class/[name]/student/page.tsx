"use client";

// next
import Link from "next/link";

// ui
import { Button } from "@/components/ui/button";

export default function StudentList({ params }: { params: { name: string } }) {
  return (
    // TODO GET tous les élèves
    <div>
      <div className="flex items-center justify-center h-screen flex-col gap-4 p-4 md:p-36">
        <Button className="bg-purple text-seasame" variant="outline">
          <Link href={`/school-dashboard/class/${params.name}/student/addStudent`}>Add a new student</Link>
        </Button>
      </div>
    </div>
  );
}