using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

var builder = WebApplication.CreateBuilder(args);


builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowLocalhost",
        policy =>
        {
            policy.SetIsOriginAllowed(origin => 
                                       new Uri(origin).Host == "localhost")
                .AllowAnyHeader()
                .AllowAnyMethod()
                .AllowCredentials();
        });
});


builder.Services.AddSignalR();

var app = builder.Build();


app.UseCors("AllowLocalhost"); 

app.Use(async (context, next) =>
{

    Console.WriteLine($"Request Path: {context.Request.Path}");
    await next.Invoke();
});


app.MapHub<GameHub>("/gameHub");

app.Run();
