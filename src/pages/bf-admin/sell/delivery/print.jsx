import { useRouter } from 'next/router';

export default function GoodsflowPrint() { 

    const router = useRouter();
    // console.log(router);  
    const data = `<html><body onload='document.forms["form"].submit()'><form name='form' method='post' action='https://ds.goodsflow.com/p2/printcm/dlvmgr.aspx'><input type='hidden' name='OTP' value=${router.query.otp} /><input type='hidden' name='responseURL' value='http://localhost:4000' /><input type='hidden' name='id' value=${router.query.id} /></form></body></html>`;
    
    return (
        <> 
            <div dangerouslySetInnerHTML={ {__html: data} }>
            </div>
        </>
        );
}

export async function getServerSideProps(context) {
    return {
      props: {},
    };
}