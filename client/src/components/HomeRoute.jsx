import MyNavbar from './MyNavbar';
import MapComponent from './Map';

function HomeRoute(props) {

    return (
        <>
            <MyNavbar type={props.type} />
            
            <div className='mapContainer'>
                <MapComponent />
            </div>

        </>

    );
}

export default HomeRoute;