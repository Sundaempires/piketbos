import React from 'react';

const Header = ({ title }) => {
    return (
        <div className='bg-white w-full py-6 px-5 fixed shadow'>
            <p>{title}</p>
        </div>
    );
}

export default Header;
