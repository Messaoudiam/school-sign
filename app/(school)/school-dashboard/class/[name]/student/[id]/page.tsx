"use client";

// react
import { useState, useEffect } from "react";

// ui
import { Card, CardContent } from "@/components/ui/card";

export default function StudentDetails({
  params,
}: {
  params: { id: string; className: string };
}) {
  const [student, setStudent] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/student?id=${params.id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (res.ok) {
          const data = await res.json();
          setStudent(data.user || null);
          setLoading(false);
        } else {
          const errorData = await res.json();
          setError(
            errorData.error || "An error occurred while fetching the student"
          );
          setLoading(false);
        }
      } catch (err) {
        console.error("Request Error:", err);
        setError("An unexpected error occurred. Please try again later.");
        setLoading(false);
      }
    };

    fetchData();
  }, [params.id]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      {error && <p className="text-red-500">{error}</p>}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {student ? (
            <Card className="w-96 mt-10 justify-center items-center">
              <CardContent className="flex flex-col justify-center items-center">
                {`${student.firstname}`}
              </CardContent>
              <CardContent className="flex flex-col justify-center items-center">
                {`${student.lastname}`}
              </CardContent>
              <CardContent className="flex flex-col justify-center items-center">
                {`${student.email}`}
              </CardContent>
            </Card>
          ) : (
            <p>No student found with this ID.</p>
          )}
        </>
      )}
    </div>
  );
}