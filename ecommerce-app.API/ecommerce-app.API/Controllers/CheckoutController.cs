using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Stripe;
using Stripe.Checkout;
using static System.Net.WebRequestMethods;
using System.Text.Json;
using System.Text.Json.Serialization;
using static System.Runtime.InteropServices.JavaScript.JSType;
using Newtonsoft.Json.Linq;
using Stripe.Issuing;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860


public class Cart
{
    public List<CartItem> items {get; set; }
}

//public interface CartItem
//    {
//    public string product { get; set; } //= string.Empty;

//    public string name { get; set; } //= string.Empty;

//    public long price { get; set; }

//     public int quantity { get; set; }

//    public string id { get; set; } //= string.Empty;
//    }

public class CartItem
{
    public string product { get; set; } = string.Empty;

    public string name { get; set; } = string.Empty;

    public decimal price { get; set; }

    public int quantity { get; set; }

    public int id { get; set; }
}


namespace ecommerce_app.API.Controllers
{
    [ApiController]
    [Route("[controller]/[action]")]
    public class CheckoutController : ControllerBase
    {
        const string APP_BASE_URL = "https://rr-ecommerce-app.netlify.app/#";

        //// GET: /<controller>/
        //public IActionResult Index()
        //{
        //    return View();
        //}

        //[HttpGet]
        //public ActionResult<string> CheckOut(String checkoutString)
        //{
        //    return checkoutString;
        //}

      

        [HttpPost]
        public ActionResult<string> Checkout([FromBody] Cart cart)
        {

            System.Diagnostics.Debug.WriteLine(cart.items.Count);
            //Console.WriteLine(request);
            //Cart cart = JsonSerializer.Deserialize<Cart>(items);
            //return Ok(items);
            /**
             * return Enumerable.Range(1, 5).Select(index => new WeatherForecast
                {
                    Date = DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
                    TemperatureC = Random.Shared.Next(-20, 55),
                    Summary = Summaries[Random.Shared.Next(Summaries.Length)]
                })
             * */
            //cart.items.n((item) => { });
            var sessionItemsOptions = cart.items.Select(x => new SessionLineItemOptions
            {
                PriceData = new SessionLineItemPriceDataOptions
                {
                    Currency = "usd",
                    ProductData = new SessionLineItemPriceDataProductDataOptions
                    {
                        Name = x.name,
                        Images = new List<string> { x.product },
                        //Description = 
                    },
                    UnitAmountDecimal = (x.price * 100),

                },
                Quantity = x.quantity,
            }).ToList();

            var options = new SessionCreateOptions
            {
                ShippingAddressCollection = new SessionShippingAddressCollectionOptions
                {
                    AllowedCountries = new List<string> { "US", "CA" },
                },
                ShippingOptions = new List<SessionShippingOptionOptions>
                {
                    new SessionShippingOptionOptions
                    {
                        ShippingRateData = new SessionShippingOptionShippingRateDataOptions
                        {
                            Type = "fixed_amount",
                            FixedAmount = new SessionShippingOptionShippingRateDataFixedAmountOptions
                            {
                                Amount = 0,
                                Currency = "usd",
                            },
                            DisplayName = "Free shipping",
                            DeliveryEstimate = new SessionShippingOptionShippingRateDataDeliveryEstimateOptions
                            {
                                Minimum = new SessionShippingOptionShippingRateDataDeliveryEstimateMinimumOptions
                                {
                                    Unit = "business_day",
                                    Value = 5,
                                },
                                Maximum = new SessionShippingOptionShippingRateDataDeliveryEstimateMaximumOptions
                                {
                                    Unit = "business_day",
                                    Value = 7,
                                },
                            },
                        },
                    },
                    new SessionShippingOptionOptions
                    {
                        ShippingRateData = new SessionShippingOptionShippingRateDataOptions
                        {
                            Type = "fixed_amount",
                            FixedAmount = new SessionShippingOptionShippingRateDataFixedAmountOptions
                            {
                                Amount = 1500,
                                Currency = "usd",
                            },
                            DisplayName = "Next day air",
                            DeliveryEstimate = new SessionShippingOptionShippingRateDataDeliveryEstimateOptions
                            {
                                Minimum = new SessionShippingOptionShippingRateDataDeliveryEstimateMinimumOptions
                                {
                                    Unit = "business_day",
                                    Value = 1,
                                },
                                Maximum = new SessionShippingOptionShippingRateDataDeliveryEstimateMaximumOptions
                                {
                                    Unit = "business_day",
                                    Value = 1,
                                },
                            },
                        },
                    },
                },

                LineItems = sessionItemsOptions,
                //{
                    //new SessionLineItemOptions
                    //{
                    //    PriceData = new SessionLineItemPriceDataOptions
                    //    {
                    //        Currency = "usd",
                    //        ProductData = new SessionLineItemPriceDataProductDataOptions {
                    //            Name = "product1",
                    //            Description = "product1's description",
                    //            //images
                    //        },
                    //        UnitAmountDecimal = 99,


                    //    },
                    //    Quantity=1,
                    //}
                    //sessionItems,
                 
                //},
                Currency = "usd",
                Mode = "payment",
                SuccessUrl = APP_BASE_URL+"/stripe/success",


                //new List<SessionLineItemOptions>(request.Select(item => {}))
                //line_items: request
            };
            

            StripeConfiguration.ApiKey = ("sk_test_51N44OYDf3xaTX0tLNTFKSCze7n60SH7lGTJsrlhlwf71Me1a8igVhUnjPT84nPuvwZevQOKIf5SiHthagQPif50O00HxZF0b3A");
            var sessionService = new SessionService();
            var session = sessionService.Create(options);

            //var items = cart?.items.Select(
            //        item =>
            //        new LineItem
            //        {
            //            Price = new Price { UnitAmount = item.price },
            //            Description = item.name,
            //            Id = item.id.ToString(),
            //        }).ToList<LineItem>();

            //var stripeItems = new StripeList<LineItem>
            //{
            //    Data = items,
            //};

            //session.LineItems = stripeItems;
            session.SuccessUrl = APP_BASE_URL + "/stripe/success";
            session.CancelUrl = APP_BASE_URL + "/stripe/cancel";
            
            return Ok(session);
        }

    }
}

