import { Aeroline } from "../../models/Flights/aeroline.model"
import { Feature } from "../../models/Lodgings/feature.model"
import { Policy } from "../../models/Lodgings/policy.model"

export class ExternalAPIsConstants {

public static readonly aerolines: Aeroline[] = [
    { id:0, name:"Avianca" },
    { id:1, name:"Copa" },
    { id:2, name:"EasyFly" },
    { id:3, name:"LATAM Airlines" },
    { id:4, name:"Satena" },
    { id:5, name:"Ultra Air" },
    { id:6, name:"Viva AIr" },
    { id:7, name:"Wingo" }]

public static readonly agents: any[] = [
    { id:0, name:"Avianca" },
    { id:1, name:"Copa" },
    { id:2, name:"EasyFly" },
    { id:3, name:"LATAM Airlines" },
    { id:4, name:"Satena" },
    { id:5, name:"Ultra Air" },
    { id:6, name:"Viva AIr" },
    { id:7, name:"Wingo" },
    { id:8, name:"Booking.com" },
    { id:9, name:"BudgetAir" },
    { id:10, name:"eDreams" },
    { id:11, name:"Expedia" },
    { id:12, name:"GotoGate" },
    { id:13, name:"Kiwi.com" },
    { id:14, name:"lastminute.com" },
    { id:15, name:"Mytrip" },
    { id:16, name:"Opodo" },
    { id:17, name:"Skyscanner" },
    { id:18, name:"Travelgenio" },
    { id:19, name:"travelup" },
    { id:20, name:"Travel2Be" },
    { id:21, name:"Trip.com" }]

public static readonly features: Feature[] =[
    { id:4, name:"Wifi" },
    { id:5, name:"Air conditioning" },
    { id:7, name:"Pool" },
    { id:8, name:"Kitchen" },
    { id:9, name:"Free parking on premises" },
    { id:11, name:"Smoking allowed" },
    { id:12, name:"Pets allowed" },
    { id:15, name:"Gym" },
    { id:16, name:"Breakfast" },
    { id:21, name:"Elevator" },
    { id:25, name:"Hot tub" },
    { id:27, name:"Indoor fireplace" },
    { id:30, name:"Heating" },
    { id:33, name:"Washer" },
    { id:34, name:"Dryer" },
    { id:35, name:"Smoke alarm" },
    { id:36, name:"Carbon monoxide alarm" },
    { id:41, name:"Shampoo" },
    { id:44, name:"Hangers" },
    { id:45, name:"Hair dryer" },
    { id:46, name:"Iron" },
    { id:47, name:"Laptop-friendly workspace" },
    { id:51, name:"Self check-in" },
    { id:58, name:"TV" },
    { id:64, name:"High chair" },
    { id:78, name:"Private bathroom" },
    { id:109, name:"Wide hallways" },
    { id:110, name:"No stairs or steps to enter" },
    { id:111, name:"Wide entrance for guests" },
    { id:112, name:"Step-free path to entrance" },
    { id:113, name:"Well-lit path to entrance" },
    { id:114, name:"Disabled parking spot" },
    { id:116, name:"Wide entrance" },
    { id:117, name:"Extra space around bed" },
    { id:118, name:"Accessible-height bed" },
    { id:121, name:"Wide doorway to guest bathroom" },
    { id:123, name:"Bathtub with bath chair" },
    { id:125, name:"Accessible-height toilet" },
    { id:136, name:"Handheld shower head" },
    { id:286, name:"Crib" },
    { id:288, name:"Electric profiling bed" },
    { id:289, name:"Mobile hoist" },
    { id:290, name:"Pool with pool hoist" },
    { id:291, name:"Ceiling hoist" },
    { id:294, name:"Fixed grab bars for shower" },
    { id:295, name:"Fixed grab bars for toilet" },
    { id:296, name:"Step-free shower" },
    { id:297, name:"Shower chair" },
    { id:347, name:"Piano" },
    { id:608, name:"Extra space around toilet" },
    { id:609, name:"Extra space around shower" }]

public static readonly featuresId: number[] = this.features.map(feature => feature.id)

public static readonly cancelPolicies: Policy[] =[
    { id:0, name:"CANCEL_MODERATE" },
    { id:1, name:"CANCEL_FLEXIBLE" },
    { id:2, name:"CANCEL_STRICT_14_WITH_GRACE_PERIOD" },
    { id:3, name:"CANCEL_STRICT" },
    { id:4, name:"CANCEL_BETTER_STRICT_WITH_GRACE_PERIOD" }]
}
