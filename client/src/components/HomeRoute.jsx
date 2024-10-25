import MyNavbar from './MyNavbar';

function HomeRoute(props) {

    return (
        <>
            <MyNavbar type={props.type} />
        </>

    );
}

export default HomeRoute;