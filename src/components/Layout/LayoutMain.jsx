import Header from '../Header/Header';

const LayoutMain = ({ title, children }) => {
    return (
        <div className="sm:w-full md:hidden flex flex-col">
            <Header title={title} />
            <div className="">
                {children}
            </div>
        </div>
    );
};


export default LayoutMain;
