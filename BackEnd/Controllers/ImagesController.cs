using BackEnd.Models;
using Firebase.Storage;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BackEnd.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ImagesController : ControllerBase
    {
        private string _firebaseStorageBucket = "workspace-b70e3.appspot.com";

        [HttpPost]
        public async Task<string> PostImage([FromBody] string imageBase64, string imageName)
        {
            byte[] imageStringToBase64 = Convert.FromBase64String(imageBase64);
            StreamContent streamContent = new(new MemoryStream(imageStringToBase64));
            Stream stream = streamContent.ReadAsStream();

            CancellationTokenSource cancellationToken = new CancellationTokenSource();

            FirebaseStorageTask storageManager = new FirebaseStorage(
                                _firebaseStorageBucket,
                                new FirebaseStorageOptions
                                {
                                    ThrowOnCancel = true
                                })
                            .Child(imageName)
                            .PutAsync(stream, cancellationToken.Token);

            string imageFromFirebaseStorage;
            imageFromFirebaseStorage = await storageManager;

            return imageFromFirebaseStorage;
        }
    }
}
