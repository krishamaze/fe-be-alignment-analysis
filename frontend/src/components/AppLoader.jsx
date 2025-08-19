import loader from '../assets/images/loader.gif';

const AppLoader = () => {
  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center bg-white bg-opacity-60">
      <div className="text-center">
        <h2 className="text-lg font-medium text-gray-800 mb-4"></h2>
        <img src={loader} alt="loading..." className="w-20 h-20" />
        <h2>Loading...</h2>
      </div>
    </div>
  );
};

export default AppLoader;
