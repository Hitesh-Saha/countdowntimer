const getUserSalt = async (username) => {
  try {
    var myHeaders = new Headers();
    myHeaders.append(
      "Authorization",
      "Bearer ZXlKaGJHY2lPaUpJVXpVeE1pSjkuZXlKcWRHa2lPaUptYzI0aUxDSmhjR2xMWlhsT1lXMWxJam9pWm1seWMzUmhjR2xyWlhraUxDSnpkV0lpT2lKbWMyNTBaWE4wSW4wLkpEVE1XVVVoZTQtNDVCMlRjbDd3ei1wdC1pWG1lVzhTQnBFdDlfaTRmTHZfZ1laVHVwb29FVlZyUnpMYndDM3hxNU1kaThfYV84aHBxLXhKbk5vQjJ3"
    );

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    const response = fetch(
      "https://keys2.vault.ziroh.com/api/v1/UserManagement/Users/User/salt" + username,
      requestOptions
    ).catch((error) => {
      throw error;
    });
    return (await response).json();
  } catch (error) {
    console.log(error);
    return false;
  }
};

export default getUserSalt;
