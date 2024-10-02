"use client";

import { Suspense } from "react";
import FatherMessage from '@/components/custom/FatherMessage';

export default function MessagesPage() {
  return (
    <Suspense
    fallback={<div>Loading...</div>}>
        <FatherMessage/>
    </Suspense>
  );
}
