import 'dotenv/config';

async function testFetch() {
    const key = 'AQ.Ab8RN6Kf4xQqnEcWhji3G4MCYWFEALprqYcUcB_zGQdT9Ee93Q';
    const url = 'https://generativelanguage.googleapis.com/v1beta/models';
    
    let res = await fetch(`${url}?key=${key}`);
    console.log("Status:", res.status);
    console.log("Body:", await res.json());
}

testFetch();
