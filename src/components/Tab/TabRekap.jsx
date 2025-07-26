import React, { useEffect, useState } from 'react';
import ButtonLaporanBulanan from '../Buttons/ButtonLaporanBulanan';

const TabRekap = () => {
    const [data, setData] = useState(null);

    // === fecth data all ===
    const fetchAllData = async () => {
        const res = await fetch("/api/data/all");
        const json = await res.json();

        if (json.success && Array.isArray(json.data)) {
            setData(json.data);
        }
    };

    useEffect(() => {
        fetchAllData()
    })

    // console.log(data);

    return (
        <div className='p-3'>
            <ButtonLaporanBulanan data={data}/>
        </div>
    );
}

export default TabRekap;
