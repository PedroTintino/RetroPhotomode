function DemoNavbar(){
    return(
        <nav className="w-100 flex justify-end p-1 items-center">
            <div className="profile flex gap-5 items-center">
                <div className="profilePicture  bg-white w-10 h-10 rounded-full">
                    <img 
                    src="https://goodnessbea.files.wordpress.com/2020/11/heather-silent-hill.jpg?w=630" 
                    alt="a profile image example" 
                    className="w-10 h-10 rounded-full"
                    />
                </div>
           </div>
        </nav>
    )
}

export default DemoNavbar;
