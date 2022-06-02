import React from "react";
import MetaTitle from "/src/components/atoms/MetaTitle";
import AdminLayout from "/src/components/admin/AdminLayout";
import { AdminContentWrapper } from "/src/components/admin/AdminWrapper";

function ChannelTalkPage() {
    return (
        <>
            <MetaTitle title="친구톡" admin={true}/>
            <AdminLayout>
                <AdminContentWrapper>ChannelTalkPage</AdminContentWrapper>
            </AdminLayout>
        </>
    );
}

export default ChannelTalkPage;


