"use client";

import React from "react";
import Layout from "../../components/Layout";
import EventList from "../../components/events/EventList";

export default function EventsPage() {
    return (
        <Layout>
            <div className="w-full max-w-4xl mx-auto">
                <EventList />
            </div>
        </Layout>
    );
}
