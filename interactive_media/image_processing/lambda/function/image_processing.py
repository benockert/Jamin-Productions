import os
import math
import boto3
import random
import logging
import mimetypes
from PIL import Image
from botocore.config import Config
from urllib.parse import unquote_plus
from botocore.exceptions import ClientError

logging.getLogger().setLevel(logging.INFO)
logger = logging.getLogger()

config = Config(region_name = 'us-east-1')

dynamo = boto3.client('dynamodb', config=config)

# TODO: move to config file
blocked = [
    "abbo",
    "abo",
    "abortion",
    "abuse",
    "addict",
    "addicts",
    "adult",
    "africa",
    "african",
    "alla",
    "allah",
    "alligatorbait",
    "amateur",
    "american",
    "anal",
    "analannie",
    "analsex",
    "angie",
    "angry",
    "anus",
    "arab",
    "arabs",
    "areola",
    "argie",
    "aroused",
    "arse",
    "arsehole",
    "asian",
    "ass",
    "assassin",
    "assassinate",
    "assassination",
    "assault",
    "assbagger",
    "assblaster",
    "assclown",
    "asscowboy",
    "asses",
    "assfuck",
    "assfucker",
    "asshat",
    "asshole",
    "assholes",
    "asshore",
    "assjockey",
    "asskiss",
    "asskisser",
    "assklown",
    "asslick",
    "asslicker",
    "asslover",
    "assman",
    "assmonkey",
    "assmunch",
    "assmuncher",
    "asspacker",
    "asspirate",
    "asspuppies",
    "assranger",
    "asswhore",
    "asswipe",
    "athletesfoot",
    "attack",
    "australian",
    "babe",
    "babies",
    "backdoor",
    "backdoorman",
    "backseat",
    "badfuck",
    "balllicker",
    "balls",
    "ballsack",
    "banging",
    "baptist",
    "barelylegal",
    "barf",
    "barface",
    "barfface",
    "bast",
    "bastard ",
    "bazongas",
    "bazooms",
    "beaner",
    "beast",
    "beastality",
    "beastial",
    "beastiality",
    "beatoff",
    "beat-off",
    "beatyourmeat",
    "beaver",
    "bestial",
    "bestiality",
    "bi",
    "biatch",
    "bible",
    "bicurious",
    "bigass",
    "bigbastard",
    "bigbutt",
    "bigger",
    "bisexual",
    "bi-sexual",
    "bitch",
    "bitcher",
    "bitches",
    "bitchez",
    "bitchin",
    "bitching",
    "bitchslap",
    "bitchy",
    "biteme",
    "black",
    "blackman",
    "blackout",
    "blacks",
    "blind",
    "blow",
    "blowjob",
    "boang",
    "bogan",
    "bohunk",
    "bollick",
    "bollock",
    "bomb",
    "bombers",
    "bombing",
    "bombs",
    "bomd",
    "bondage",
    "boner",
    "bong",
    "boob",
    "boobies",
    "boobs",
    "booby",
    "boody",
    "boom",
    "boong",
    "boonga",
    "boonie",
    "booty",
    "bootycall",
    "bountybar",
    "bra",
    "brea5t",
    "breast",
    "breastjob",
    "breastlover",
    "breastman",
    "brothel",
    "bugger",
    "buggered",
    "buggery",
    "bullcrap",
    "bulldike",
    "bulldyke",
    "bullshit",
    "bumblefuck",
    "bumfuck",
    "bunga",
    "bunghole",
    "buried",
    "burn",
    "butchbabes",
    "butchdike",
    "butchdyke",
    "butt",
    "buttbang",
    "butt-bang",
    "buttface",
    "buttfuck",
    "butt-fuck",
    "buttfucker",
    "butt-fucker",
    "buttfuckers",
    "butt-fuckers",
    "butthead",
    "buttman",
    "buttmunch",
    "buttmuncher",
    "buttpirate",
    "buttplug",
    "buttstain",
    "byatch",
    "cacker",
    "cameljockey",
    "cameltoe",
    "canadian",
    "cancer",
    "carpetmuncher",
    "carruth",
    "catholic",
    "catholics",
    "cemetery",
    "chav",
    "cherrypopper",
    "chickslick",
    "children's",
    "chin",
    "chinaman",
    "chinamen",
    "chinese",
    "chink",
    "chinky",
    "choad",
    "chode",
    "christ",
    "christian",
    "church",
    "cigarette",
    "cigs",
    "clamdigger",
    "clamdiver",
    "clit",
    "clitoris",
    "clogwog",
    "cocaine",
    "cock",
    "cockblock",
    "cockblocker",
    "cockcowboy",
    "cockfight",
    "cockhead",
    "cockknob",
    "cocklicker",
    "cocklover",
    "cocknob",
    "cockqueen",
    "cockrider",
    "cocksman",
    "cocksmith",
    "cocksmoker",
    "cocksucer",
    "cocksuck ",
    "cocksucked ",
    "cocksucker",
    "cocksucking",
    "cocktail",
    "cocktease",
    "cocky",
    "cohee",
    "coitus",
    "color",
    "colored",
    "coloured",
    "commie",
    "communist",
    "condom",
    "conservative",
    "conspiracy",
    "coolie",
    "cooly",
    "coon",
    "coondog",
    "copulate",
    "cornhole",
    "corruption",
    "cra5h",
    "crabs",
    "crack",
    "crackpipe",
    "crackwhore",
    "crack-whore",
    "crap",
    "crapola",
    "crapper",
    "crappy",
    "crash",
    "creamy",
    "crime",
    "crimes",
    "criminal",
    "criminals",
    "crotch",
    "crotchjockey",
    "crotchmonkey",
    "crotchrot",
    "cum",
    "cumbubble",
    "cumfest",
    "cumjockey",
    "cumm",
    "cummer",
    "cumming",
    "cumquat",
    "cumqueen",
    "cumshot",
    "cunilingus",
    "cunillingus",
    "cunn",
    "cunnilingus",
    "cunntt",
    "cunt",
    "cunteyed",
    "cuntfuck",
    "cuntfucker",
    "cuntlick ",
    "cuntlicker ",
    "cuntlicking ",
    "cuntsucker",
    "cybersex",
    "cyberslimer",
    "dago",
    "dahmer",
    "dammit",
    "damn",
    "damnation",
    "damnit",
    "darkie",
    "darky",
    "datnigga",
    "dead",
    "deapthroat",
    "death",
    "deepthroat",
    "defecate",
    "dego",
    "demon",
    "deposit",
    "desire",
    "destroy",
    "deth",
    "devil",
    "devilworshipper",
    "dick",
    "dickbrain",
    "dickforbrains",
    "dickhead",
    "dickless",
    "dicklick",
    "dicklicker",
    "dickman",
    "dickwad",
    "dickweed",
    "diddle",
    "die",
    "died",
    "dies",
    "dike",
    "dildo",
    "dingleberry",
    "dink",
    "dipshit",
    "dipstick",
    "dirty",
    "disease",
    "diseases",
    "disturbed",
    "dive",
    "dix",
    "dixiedike",
    "dixiedyke",
    "doggiestyle",
    "doggystyle",
    "dong",
    "doodoo",
    "doo-doo",
    "doom",
    "dope",
    "dragqueen",
    "dragqween",
    "dripdick",
    "drug",
    "drunk",
    "drunken",
    "dumb",
    "dumbass",
    "dumbbitch",
    "dumbfuck",
    "dyefly",
    "dyke",
    "easyslut",
    "eatballs",
    "eatme",
    "eatpussy",
    "ecstacy",
    "ejaculate",
    "ejaculated",
    "ejaculating ",
    "ejaculation",
    "enema",
    "enemy",
    "erect",
    "erection",
    "ero",
    "escort",
    "ethiopian",
    "ethnic",
    "european",
    "evl",
    "excrement",
    "execute",
    "executed",
    "execution",
    "executioner",
    "explosion",
    "facefucker",
    "faeces",
    "fag",
    "fagging",
    "faggot",
    "fagot",
    "failed",
    "failure",
    "fairies",
    "fairy",
    "faith",
    "fannyfucker",
    "fart",
    "farted ",
    "farting ",
    "farty ",
    "fastfuck",
    "fat",
    "fatah",
    "fatass",
    "fatfuck",
    "fatfucker",
    "fatso",
    "fckcum",
    "fear",
    "feces",
    "felatio ",
    "felch",
    "felcher",
    "felching",
    "fellatio",
    "feltch",
    "feltcher",
    "feltching",
    "fetish",
    "fight",
    "filipina",
    "filipino",
    "fingerfood",
    "fingerfuck ",
    "fingerfucked ",
    "fingerfucker ",
    "fingerfuckers",
    "fingerfucking ",
    "fire",
    "firing",
    "fister",
    "fistfuck",
    "fistfucked ",
    "fistfucker ",
    "fistfucking ",
    "fisting",
    "flange",
    "flasher",
    "flatulence",
    "floo",
    "flydie",
    "flydye",
    "fok",
    "fondle",
    "footaction",
    "footfuck",
    "footfucker",
    "footlicker",
    "footstar",
    "fore",
    "foreskin",
    "forni",
    "fornicate",
    "foursome",
    "fourtwenty",
    "fraud",
    "freakfuck",
    "freakyfucker",
    "freefuck",
    "fu",
    "fubar",
    "fuc",
    "fucck",
    "fuck",
    "fucka",
    "fuckable",
    "fuckbag",
    "fuckbuddy",
    "fucked",
    "fuckedup",
    "fucker",
    "fuckers",
    "fuckface",
    "fuckfest",
    "fuckfreak",
    "fuckfriend",
    "fuckhead",
    "fuckher",
    "fuckin",
    "fuckina",
    "fucking",
    "fuckingbitch",
    "fuckinnuts",
    "fuckinright",
    "fuckit",
    "fuckknob",
    "fuckme ",
    "fuckmehard",
    "fuckmonkey",
    "fuckoff",
    "fuckpig",
    "fucks",
    "fucktard",
    "fuckwhore",
    "fuckyou",
    "fudgepacker",
    "fugly",
    "fuk",
    "fuks",
    "funeral",
    "funfuck",
    "fungus",
    "fuuck",
    "gangbang",
    "gangbanged ",
    "gangbanger",
    "gangsta",
    "gatorbait",
    "gay",
    "gaymuthafuckinwhore",
    "gaysex ",
    "geez",
    "geezer",
    "geni",
    "genital",
    "german",
    "getiton",
    "gin",
    "ginzo",
    "gipp",
    "girls",
    "givehead",
    "glazeddonut",
    "gob",
    "god",
    "godammit",
    "goddamit",
    "goddammit",
    "goddamn",
    "goddamned",
    "goddamnes",
    "goddamnit",
    "goddamnmuthafucker",
    "goldenshower",
    "gonorrehea",
    "gonzagas",
    "gook",
    "gotohell",
    "goy",
    "goyim",
    "greaseball",
    "gringo",
    "groe",
    "gross",
    "grostulation",
    "gubba",
    "gummer",
    "gun",
    "gyp",
    "gypo",
    "gypp",
    "gyppie",
    "gyppo",
    "gyppy",
    "hamas",
    "handjob",
    "hapa",
    "harder",
    "hardon",
    "harem",
    "headfuck",
    "headlights",
    "hebe",
    "heeb",
    "hell",
    "henhouse",
    "heroin",
    "herpes",
    "heterosexual",
    "hijack",
    "hijacker",
    "hijacking",
    "hillbillies",
    "hindoo",
    "hiscock",
    "hitler",
    "hitlerism",
    "hitlerist",
    "hiv",
    "ho",
    "hobo",
    "hodgie",
    "hoes",
    "hole",
    "holestuffer",
    "homicide",
    "homo",
    "homobangers",
    "homosexual",
    "honger",
    "honk",
    "honkers",
    "honkey",
    "honky",
    "hook",
    "hooker",
    "hookers",
    "hooters",
    "hore",
    "hork",
    "horn",
    "horney",
    "horniest",
    "horny",
    "horseshit",
    "hosejob",
    "hoser",
    "hostage",
    "hotdamn",
    "hotpussy",
    "hottotrot",
    "hummer",
    "husky",
    "hussy",
    "hustler",
    "hymen",
    "hymie",
    "iblowu",
    "idiot",
    "ikey",
    "illegal",
    "incest",
    "insest",
    "intercourse",
    "interracial",
    "intheass",
    "inthebuff",
    "israel",
    "israeli",
    "israel's",
    "italiano",
    "itch",
    "jackass",
    "jackoff",
    "jackshit",
    "jacktheripper",
    "jade",
    "jap",
    "japanese",
    "japcrap",
    "jebus",
    "jeez",
    "jerkoff",
    "jesus",
    "jesuschrist",
    "jew",
    "jewish",
    "jiga",
    "jigaboo",
    "jigg",
    "jigga",
    "jiggabo",
    "jigger ",
    "jiggy",
    "jihad",
    "jijjiboo",
    "jimfish",
    "jism",
    "jiz ",
    "jizim",
    "jizjuice",
    "jizm ",
    "jizz",
    "jizzim",
    "jizzum",
    "joint",
    "juggalo",
    "jugs",
    "junglebunny",
    "kaffer",
    "kaffir",
    "kaffre",
    "kafir",
    "kanake",
    "kid",
    "kigger",
    "kike",
    "kill",
    "killed",
    "killer",
    "killing",
    "kills",
    "kink",
    "kinky",
    "kissass",
    "kkk",
    "knife",
    "knockers",
    "kock",
    "kondum",
    "koon",
    "kotex",
    "krap",
    "krappy",
    "kraut",
    "kum",
    "kumbubble",
    "kumbullbe",
    "kummer",
    "kumming",
    "kumquat",
    "kums",
    "kunilingus",
    "kunnilingus",
    "kunt",
    "ky",
    "kyke",
    "lactate",
    "laid",
    "lapdance",
    "latin",
    "lesbain",
    "lesbayn",
    "lesbian",
    "lesbin",
    "lesbo",
    "lez",
    "lezbe",
    "lezbefriends",
    "lezbo",
    "lezz",
    "lezzo",
    "liberal",
    "libido",
    "licker",
    "lickme",
    "lies",
    "limey",
    "limpdick",
    "limy",
    "lingerie",
    "liquor",
    "livesex",
    "loadedgun",
    "lolita",
    "looser",
    "loser",
    "lotion",
    "lovebone",
    "lovegoo",
    "lovegun",
    "lovejuice",
    "lovemuscle",
    "lovepistol",
    "loverocket",
    "lowlife",
    "lsd",
    "lubejob",
    "lucifer",
    "luckycammeltoe",
    "lugan",
    "lynch",
    "macaca",
    "mad",
    "mafia",
    "magicwand",
    "mams",
    "manhater",
    "manpaste",
    "marijuana",
    "mastabate",
    "mastabater",
    "masterbate",
    "masterblaster",
    "mastrabator",
    "masturbate",
    "masturbating",
    "mattressprincess",
    "meatbeatter",
    "meatrack",
    "meth",
    "mexican",
    "mgger",
    "mggor",
    "mickeyfinn",
    "mideast",
    "milf",
    "minority",
    "mockey",
    "mockie",
    "mocky",
    "mofo",
    "moky",
    "moles",
    "molest",
    "molestation",
    "molester",
    "molestor",
    "moneyshot",
    "mooncricket",
    "mormon",
    "moron",
    "moslem",
    "mosshead",
    "mothafuck",
    "mothafucka",
    "mothafuckaz",
    "mothafucked ",
    "mothafucker",
    "mothafuckin",
    "mothafucking ",
    "mothafuckings",
    "motherfuck",
    "motherfucked",
    "motherfucker",
    "motherfuckin",
    "motherfucking",
    "motherfuckings",
    "motherlovebone",
    "muff",
    "muffdive",
    "muffdiver",
    "muffindiver",
    "mufflikcer",
    "mulatto",
    "muncher",
    "munt",
    "murder",
    "murderer",
    "muslim",
    "naked",
    "narcotic",
    "nasty",
    "nastybitch",
    "nastyho",
    "nastyslut",
    "nastywhore",
    "nazi",
    "necro",
    "negro",
    "negroes",
    "negroid",
    "negro's",
    "nig",
    "niger",
    "nigerian",
    "nigerians",
    "nigg",
    "nigga",
    "niggah",
    "niggaracci",
    "niggard",
    "niggarded",
    "niggarding",
    "niggardliness",
    "niggardliness's",
    "niggardly",
    "niggards",
    "niggard's",
    "niggaz",
    "nigger",
    "niggerhead",
    "niggerhole",
    "niggers",
    "nigger's",
    "niggle",
    "niggled",
    "niggles",
    "niggling",
    "nigglings",
    "niggor",
    "niggur",
    "niglet",
    "nignog",
    "nigr",
    "nigra",
    "nigre",
    "nip",
    "nipple",
    "nipplering",
    "nittit",
    "nlgger",
    "nlggor",
    "nofuckingway",
    "nook",
    "nookey",
    "nookie",
    "noonan",
    "nooner",
    "nude",
    "nudger",
    "nuke",
    "nutfucker",
    "nymph",
    "ontherag",
    "oral",
    "orga",
    "orgasim ",
    "orgasm",
    "orgies",
    "orgy",
    "osama",
    "paki",
    "palesimian",
    "palestinian",
    "pansies",
    "pansy",
    "panti",
    "panties",
    "payo",
    "pearlnecklace",
    "peck",
    "pecker",
    "peckerwood",
    "pee",
    "peehole",
    "pee-pee",
    "peepshow",
    "peepshpw",
    "pendy",
    "penetration",
    "peni5",
    "penile",
    "penis",
    "penises",
    "penthouse",
    "period",
    "perv",
    "phonesex",
    "phuk",
    "phuked",
    "phuking",
    "phukked",
    "phukking",
    "phungky",
    "phuq",
    "pi55",
    "picaninny",
    "piccaninny",
    "pickaninny",
    "piker",
    "pikey",
    "piky",
    "pimp",
    "pimped",
    "pimper",
    "pimpjuic",
    "pimpjuice",
    "pimpsimp",
    "pindick",
    "piss",
    "pissed",
    "pisser",
    "pisses ",
    "pisshead",
    "pissin ",
    "pissing",
    "pissoff ",
    "pistol",
    "pixie",
    "pixy",
    "playboy",
    "playgirl",
    "pocha",
    "pocho",
    "pocketpool",
    "pohm",
    "polack",
    "pom",
    "pommie",
    "pommy",
    "poo",
    "poon",
    "poontang",
    "poop",
    "pooper",
    "pooperscooper",
    "pooping",
    "poorwhitetrash",
    "popimp",
    "porchmonkey",
    "porn",
    "pornflick",
    "pornking",
    "porno",
    "pornography",
    "pornprincess",
    "pot",
    "poverty",
    "premature",
    "pric",
    "prick",
    "prickhead",
    "primetime",
    "propaganda",
    "pros",
    "prostitute",
    "protestant",
    "pu55i",
    "pu55y",
    "pube",
    "pubic",
    "pubiclice",
    "pud",
    "pudboy",
    "pudd",
    "puddboy",
    "puke",
    "puntang",
    "purinapricness",
    "puss",
    "pussie",
    "pussies",
    "pussy",
    "pussycat",
    "pussyeater",
    "pussyfucker",
    "pussylicker",
    "pussylips",
    "pussylover",
    "pussypounder",
    "pusy",
    "quashie",
    "queef",
    "queer",
    "quickie",
    "quim",
    "ra8s",
    "rabbi",
    "racial",
    "racist",
    "radical",
    "radicals",
    "raghead",
    "randy",
    "rape",
    "raped",
    "raper",
    "rapist",
    "rearend",
    "rearentry",
    "rectum",
    "redlight",
    "redneck",
    "reefer",
    "reestie",
    "refugee",
    "reject",
    "remains",
    "rentafuck",
    "republican",
    "rere",
    "retard",
    "retarded",
    "ribbed",
    "rigger",
    "rimjob",
    "rimming",
    "roach",
    "robber",
    "roundeye",
    "rump",
    "russki",
    "russkie",
    "sadis",
    "sadom",
    "samckdaddy",
    "sandm",
    "sandnigger",
    "satan",
    "scag",
    "scallywag",
    "scat",
    "schlong",
    "screw",
    "screwyou",
    "scrotum",
    "scum",
    "semen",
    "seppo",
    "servant",
    "sex",
    "sexed",
    "sexfarm",
    "sexhound",
    "sexhouse",
    "sexing",
    "sexkitten",
    "sexpot",
    "sexslave",
    "sextogo",
    "sextoy",
    "sextoys",
    "sexual",
    "sexually",
    "sexwhore",
    "sexy",
    "sexymoma",
    "sexy-slim",
    "shag",
    "shaggin",
    "shagging",
    "shat",
    "shav",
    "shawtypimp",
    "sheeney",
    "shhit",
    "shinola",
    "shit",
    "shitcan",
    "shitdick",
    "shite",
    "shiteater",
    "shited",
    "shitface",
    "shitfaced",
    "shitfit",
    "shitforbrains",
    "shitfuck",
    "shitfucker",
    "shitfull",
    "shithapens",
    "shithappens",
    "shithead",
    "shithouse",
    "shiting",
    "shitlist",
    "shitola",
    "shitoutofluck",
    "shits",
    "shitstain",
    "shitted",
    "shitter",
    "shitting",
    "shitty ",
    "shoot",
    "shooting",
    "shortfuck",
    "showtime",
    "sick",
    "sissy",
    "sixsixsix",
    "sixtynine",
    "sixtyniner",
    "skank",
    "skankbitch",
    "skankfuck",
    "skankwhore",
    "skanky",
    "skankybitch",
    "skankywhore",
    "skinflute",
    "skum",
    "skumbag",
    "slant",
    "slanteye",
    "slapper",
    "slaughter",
    "slav",
    "slave",
    "slavedriver",
    "sleezebag",
    "sleezeball",
    "slideitin",
    "slime",
    "slimeball",
    "slimebucket",
    "slopehead",
    "slopey",
    "slopy",
    "slut",
    "sluts",
    "slutt",
    "slutting",
    "slutty",
    "slutwear",
    "slutwhore",
    "smack",
    "smackthemonkey",
    "smut",
    "snatch",
    "snatchpatch",
    "snigger",
    "sniggered",
    "sniggering",
    "sniggers",
    "snigger's",
    "sniper",
    "snot",
    "snowback",
    "snownigger",
    "sob",
    "sodom",
    "sodomise",
    "sodomite",
    "sodomize",
    "sodomy",
    "sonofabitch",
    "sonofbitch",
    "sooty",
    "sos",
    "soviet",
    "spaghettibender",
    "spaghettinigger",
    "spank",
    "spankthemonkey",
    "sperm",
    "spermacide",
    "spermbag",
    "spermhearder",
    "spermherder",
    "spic",
    "spick",
    "spig",
    "spigotty",
    "spik",
    "spit",
    "spitter",
    "splittail",
    "spooge",
    "spreadeagle",
    "spunk",
    "spunky",
    "squaw",
    "stagg",
    "stiffy",
    "strapon",
    "stringer",
    "stripclub",
    "stroke",
    "stroking",
    "stupid",
    "stupidfuck",
    "stupidfucker",
    "suck",
    "suckdick",
    "sucker",
    "suckme",
    "suckmyass",
    "suckmydick",
    "suckmytit",
    "suckoff",
    "suicide",
    "swallow",
    "swallower",
    "swalow",
    "swastika",
    "sweetness",
    "syphilis",
    "taboo",
    "taff",
    "tampon",
    "tang",
    "tantra",
    "tarbaby",
    "tard",
    "teat",
    "terror",
    "terrorist",
    "teste",
    "testicle",
    "testicles",
    "thicklips",
    "thirdeye",
    "thirdleg",
    "threesome",
    "threeway",
    "timbernigger",
    "tinkle",
    "tit",
    "titbitnipply",
    "titfuck",
    "titfucker",
    "titfuckin",
    "titjob",
    "titlicker",
    "titlover",
    "tits",
    "tittie",
    "titties",
    "titty",
    "tnt",
    "toilet",
    "tongethruster",
    "tongue",
    "tonguethrust",
    "tonguetramp",
    "tortur",
    "torture",
    "tosser",
    "towelhead",
    "trailertrash",
    "tramp",
    "trannie",
    "tranny",
    "transexual",
    "transsexual",
    "transvestite",
    "triplex",
    "trisexual",
    "trojan",
    "trots",
    "tuckahoe",
    "tunneloflove",
    "turd",
    "turnon",
    "twat",
    "twink",
    "twinkie",
    "twobitwhore",
    "uck",
    "uk",
    "unfuckable",
    "upskirt",
    "uptheass",
    "upthebutt",
    "urinary",
    "urinate",
    "urine",
    "usama",
    "uterus",
    "vagina",
    "vaginal",
    "vatican",
    "vibr",
    "vibrater",
    "vibrator",
    "vietcong",
    "violence",
    "virgin",
    "virginbreaker",
    "vomit",
    "vulva",
    "wab",
    "wank",
    "wanker",
    "wanking",
    "waysted",
    "weapon",
    "weenie",
    "weewee",
    "welcher",
    "welfare",
    "wetb",
    "wetback",
    "wetspot",
    "whacker",
    "whash",
    "whigger",
    "whiskey",
    "whiskeydick",
    "whiskydick",
    "whit",
    "whitenigger",
    "whites",
    "whitetrash",
    "whitey",
    "whiz",
    "whop",
    "whore",
    "whorefucker",
    "whorehouse",
    "wigger",
    "willie",
    "williewanker",
    "willy",
    "wog",
    "women's",
    "wop",
    "wtf",
    "wuss",
    "wuzzie",
    "xtc",
    "xxx",
    "yankee",
    "yellowman",
    "zigabo",
    "zipperhead",
    # additional
    "fck",
    "sht",
    "btch",
    "ngga",
    "bstrd",
    "bullsht",
    "shthed",
    "shthd",
    "hate",
    "hated",
    "trump",
    "biden",
    "maga",
    "klux",
    "supremacy",
    "fug",
    "fugg",
    "bllsht",
    "feck",
    "fahk",
    "fick",
    "a$$"
]

def handler(event, context):
    try:
        # get the s3 object from the event (assumption that this lambda is being triggered by an S3 event)
        bucket = event['Records'][0]['s3']['bucket']['name']
        file_key = unquote_plus(event['Records'][0]['s3']['object']['key'], encoding='utf-8')
    
        # process our image by checking for inappropriate content and resizing
        enabled, labels_string = detect_labels(bucket, file_key)
        ddb_partition_key, ddb_sort_key = process_image(bucket, file_key)

        # assumption is the image submission has been set to inactive in ddb, update to active if the image passes our checks
        if (enabled):
            logger.info("Image passes checks, updating active status in ddb and assigning position in mosaic")
            mosaic_position_info = get_event_mosaic_position_info(ddb_partition_key)
            position = assign_position(ddb_partition_key, mosaic_position_info["value"]["L"])
            result = enable_submission_in_ddb(ddb_partition_key, ddb_sort_key, position, labels_string)
            if (result == 200):
                logger.info("Successfully updated active status and position of {}".format(ddb_partition_key))
            else:
                logger.error("Unsucessful attempt at updating active status and position of {}".format(ddb_partition_key))
        else:
            logger.info("Found inappropriate image, nothing to update in ddb.")
        
    except Exception as e:
        logger.exception(e)
        raise e
    
def get_event_mosaic_position_info(event_key):
    """
    Gets information about available positions in the photo mosaic for the given event
    """
    table_name = os.environ["EVENTS_TABLE"]

    try:
        mosaic_info = dynamo.get_item(
            TableName=table_name,
            Key={
                'event_id': {
                    "S": f"{str(event_key)}.photomosaic.available_positions",
                }
            },
            ConsistentRead=True, # need strong consistency
        )
    except ClientError as err:
        logger.error(
            "Couldn't get mosaic info from table %s for event with id %s. Here's why: %s: %s",
            table_name,
            event_key,
            err.response["Error"]["Code"],
            err.response["Error"]["Message"],
        )
        # return dictionary with empty/default values for 'fields_to_return'
        return {"available_positions": {"L": []}}
    else:
        return mosaic_info['Item']

def assign_position(event_key, available_positions, retry=True):
    """
    Selects a random position from the given list, returns that position as well as updates the table with the new available positions

    Returns a tuple (x, y) of the position (if there are no available positions, position will be (-1,-1)
    """
    if not len(available_positions):
        # return early if there are no available positions
        logging.info("No available positions!")
        return (-1, -1)
    
    rand = random.randrange(0, len(available_positions)) # can't use rand int unless we subtract one from upper range
    position = available_positions.pop(rand) # assign the position and remove from the available_positions list at the same time

    # try to update available positions
    success = update_available_positions(event_key, available_positions)
    # TODO: add some retry, but not that important because worst case is an overwrite

    x, y = position["M"]["x"]["N"], position["M"]["y"]["N"]
    logging.info(f"Selected position ({x}, {y})")
    return (x, y)

def update_available_positions(event_key, new_positions):
    """
    Updates the event mosaic information associated with the given event with the new list of available positions; returns success or not
    """
    table_name = os.environ["EVENTS_TABLE"]
    try:
        dynamo.update_item(
            TableName=table_name,
            Key={"event_id": {"S": f"{event_key}.photomosaic.available_positions"}},
            UpdateExpression="set #v=:r",
            ExpressionAttributeNames={"#v": "value"},
            ExpressionAttributeValues={":r": {"L": new_positions}},
        )
    except ClientError as err:
        logger.error(
            "Couldn't update available positions for %s in table %s. Here's why: %s: %s",
            event_key,
            table_name,
            err.response["Error"]["Code"],
            err.response["Error"]["Message"],
        )
        return False
    else:
        return True
    
def enable_submission_in_ddb(partition_key, sort_key, position, labels):
    """
    Updates active to true for the DDB item with the given keys and adds position information based on the given position tuple (x, y)
    """
    table_name = os.environ['MEDIA_TABLE']
    try:
        result = dynamo.update_item(
            TableName=table_name,
            Key={"event_name": {"S": partition_key}, "image_key": {"S": sort_key}},
            UpdateExpression="set active=:r, #px=:px, #py=:py, #tkns=:tkns",
            ExpressionAttributeNames={"#px": "position_x", "#py": "position_y", "#tkns": "tokens"},
            ExpressionAttributeValues={":r": {"BOOL": True}, ":px": {"N": str(position[0])}, ":py": {"N": str(position[1])}, ":tkns": {"S": str(labels)}},
        )
    except ClientError as err:
        logger.error(
            "Couldn't set %s to active with position (%s,%s) in table %s. Here's why: %s: %s",
            sort_key,
            position[0],
            position[1],
            table_name,
            err.response["Error"]["Code"],
            err.response["Error"]["Message"],
        )
        return 500
    else:
        return result["ResponseMetadata"]["HTTPStatusCode"]


def resize_image(in_path, out_path):
    """
    Resizes the image at the given in path to be a perfect square, saves the cropped image to the given out path
    """
    with Image.open(in_path) as image:
        width, height = image.size
        if width == height:
            # nothing to do, just move/rename
            image.save(out_path)
        if width > height:
            # wider than tall, crop in the left and right to match the height
            center_width = math.floor(width / 2)
            center_height = math.floor(height / 2)
            new_width_and_height = center_height * 2
            new_left = center_width - (new_width_and_height / 2)
            new_right = center_width + (new_width_and_height / 2)

            # crop(left, upper, right, lower)
            image.crop((new_left, 0, new_right, new_width_and_height)).save(out_path)
        else:
            # taller than wide, crop in the bottom and top to match the width
            center_width = math.floor(width / 2)
            center_height = math.floor(height / 2)
            new_width_and_height = center_width * 2
            new_top = center_height - (new_width_and_height / 2)
            new_bottom = center_height + (new_width_and_height / 2)

            # crop(left, upper, right, lower)
            image.crop((0, new_top, new_width_and_height, new_bottom)).save(out_path)

def create_thumbnail(in_path, out_path, size):
    """
    Creates a thumbnail of the image at the given in path with the given size, saves the thumbnail to the given out path
    """
    with Image.open(in_path) as image:
        image.thumbnail((size, size))
        image.save(out_path)
    
def process_image(bucket, key, local_folder="/tmp"):
    """
    Crops images to be square and creates a thumbnail for them
    """
    image_name = key.split("/")[-1]
    logger.info("New image: {} has been uploaded to {}/{} | Processing image...".format(image_name, bucket, key))

    s3 = boto3.client('s3')

    key_split = key.split(".")
    resized_name = "-resized.".join(key_split).replace("upload/", "processed/") # adds '-resized' to the end pf the filename and replaces upload folder with processed folder
    thumbnail_name = "-thumbnail.".join(key_split).replace("upload/", "processed/") # adds '-thumbnail' to the end pf the filename and replaces upload folder with processed folder

    download_path_local = '{}/{}'.format(local_folder, key.replace("/", "_"))
    resized_path_local = '{}/{}'.format(local_folder, resized_name.replace("/", "_"))
    thumbnail_path_local = '{}/{}'.format(local_folder, thumbnail_name.replace("/", "_"))  

    s3.download_file(bucket, key, download_path_local)
    file_content_type = mimetypes.guess_type(download_path_local)[0]
    resize_image(download_path_local, resized_path_local)
    create_thumbnail(resized_path_local, thumbnail_path_local, 200)

    logger.info("Uploading resized photo to {}/{}".format(bucket, resized_name))
    # s3.upload_file(resized_path_local, bucket, resized_name, ExtraArgs={"Metadata": {"Content-Type": file_content_type}})
    with open(resized_path_local, "rb") as file:
        s3.put_object(
            Bucket=bucket,
            Body=file,
            Key=resized_name,
            ContentType=file_content_type
        )

    logger.info("Uploading thumbnail photo to {}/{}".format(bucket, thumbnail_name))
    # s3.upload_file(thumbnail_path_local, bucket, thumbnail_name, ExtraArgs={"Metadata": {"Content-Type": file_content_type}})
    with open(thumbnail_path_local, "rb") as file:
        s3.put_object(
            Bucket=bucket,
            Body=file,
            Key=thumbnail_name,
            ContentType=file_content_type
        )

    return key.split("/")[-3], f"image.{image_name.split('.')[-2]}"

def detect_labels(bucket, key):
    """
    Runs the image at the given bucket/key through AWS Rekognition and detects any moderation labels or other labels signifying the image may be innapropriate 

    :return: true if the image is approved, false if not, and either the relevant tokens that caused the denial, or just all detected labels in case of an approval
    """
    blocked_labels = ["Alcohol", "Beer", "Wine", "Wine Bottle", "Smoking", "Rifle", "Gun"]

    image_name = key.split("/")[-1]
    logger.info("New image: {} has been uploaded to {}/{} | Running label check...".format(image_name, bucket, key))

    rekognition = boto3.client('rekognition', config=config)
    image = RekognitionImage({'S3Object':{'Bucket':bucket,'Name':key}}, image_name, rekognition)

    mod_labels = image.detect_moderation_labels()
    mod_label_names = [l.name for l in mod_labels]
    mod_label_names_string = ", ".join(mod_label_names)
    if len(mod_labels):
        logging.info("Found moderation content in {}, will be set to not appear in interactive media displays: {}".format(image_name, mod_label_names_string))
        return False, mod_label_names_string
    
    labels = image.detect_labels()
    label_names = [l.name for l in labels]
    label_names_string = ", ".join(label_names)
    matched_blocked_labels = [x for x in blocked_labels if x in label_names] # block_labels is likely a shorter array than detected labels
    matched_blocked_labels_string = ", ".join(matched_blocked_labels)
    if any(matched_blocked_labels):
        logging.info("Found blocked content in {}, will be set to not appear in interactive media displays: {}".format(image_name, matched_blocked_labels_string))
        return False, matched_blocked_labels_string
    
    text = image.detect_text()
    matched_blocked_words = [x for x in text if x.lower() in blocked] # text is certainly a shorter array than blocked words
    matched_blocked_words_string = ", ".join(matched_blocked_words)
    if any(matched_blocked_words):
        logging.info("Found inappropriate words in {}, will be set to not appear in interactive media displays: {}".format(image_name, matched_blocked_words_string))
        return False, matched_blocked_words_string

    logging.info("Image has been approved")
    return True, label_names_string

class RekognitionImage:
    """
    Encapsulates an Amazon Rekognition image. This class is a thin wrapper
    around parts of the Boto3 Amazon Rekognition API.
    """

    def __init__(self, image, image_name, rekognition_client):
        """
        Initializes the image object.

        :param image: Data that defines the image, either the image bytes or
                      an Amazon S3 bucket and object key.
        :param image_name: The name of the image.
        :param rekognition_client: A Boto3 Rekognition client.
        """
        self.image = image
        self.image_name = image_name
        self.rekognition_client = rekognition_client
        self.config = {'MinConfidence': 50} # move to env variable

    def detect_moderation_labels(self):
        """
        Detects moderation labels in the image. Moderation labels identify content
        that may be inappropriate for some audiences.

        :return: The list of moderation labels found in the image.
        """
        try:
            response = self.rekognition_client.detect_moderation_labels(
                Image=self.image, **self.config
            )
            labels = [
                RekognitionModerationLabel(label)
                for label in response["ModerationLabels"]
            ]
            logger.debug(
                "Found %s moderation labels in %s: %s", len(labels), self.image_name, ", ".join([l.name for l in labels])
            )
        except ClientError:
            logger.exception(
                "Couldn't detect moderation labels in %s", self.image_name
            )
            raise
        else:
            return labels
        
    def detect_labels(self):
        """
        Detects labels in the image.

        :return: The list of labels found in the image.
        """
        try:
            response = self.rekognition_client.detect_labels(
                Image=self.image, **self.config
            )
            labels = [
                RekognitionLabel(label)
                for label in response["Labels"]
            ]
            logger.debug(
                "Found %s labels in %s: %s", len(labels), self.image_name, ", ".join([l.name for l in labels])
            )
        except ClientError:
            logger.exception(
                "Couldn't detect labels in %s", self.image_name
            )
            raise
        else:
            return labels
    
    def detect_text(self):
        """
        Detects text in the image.

        :return: The list of words found in the image.
        """
        try:
            response = self.rekognition_client.detect_text(Image=self.image)

            textDetections = response['TextDetections']

            words = [x['DetectedText'] for x in textDetections if x['Type'] == 'WORD']
            logger.debug(
                "Found %s words in %s: %s", len(words), self.image_name, ", ".join(words)
            )
        except ClientError:
            logger.exception(
                "Couldn't detect labels in %s", self.image_name
            )
            raise
        else:
            return words


class RekognitionLabel:
    def __init__(self, label_obj):
        self.name = label_obj["Name"]
        self.confidence = label_obj["Confidence"]

    def to_string(self):
        return f"Label: {self.name} | Confidence: {self.confidence}"
        
class RekognitionModerationLabel(RekognitionLabel):
    def __init__(self, label_obj):
        super().__init__(label_obj)
        # self.parent_name = label_obj["ParentName"]
        # self.taxonomy_level = label_obj["TaxonomyLevel"]

# for local testing
# if __name__ == "__main__":
#     logging.basicConfig(
#         level=logging.INFO,
#         handlers=[
#             logging.StreamHandler()
#         ]
#     )

#     bucket = "static.jaminproductions.com"
#     key = "dev/interactive_media/photo_mosaic/northeastern2024/upload/5b3e44b0-8824-4d90-8f40-c57ad1239633.jpg"
#     result = True #detect_labels(bucket, key)
#     ddb_sort_key, ddb_partition_key = ("image.1710481050226-025e7099-e2d9-4197-84b2-6e64a6132976", "northeastern2024") #process_image(bucket, key, "./test")
#     if (result):
#         logger.info("Image passes checks, updating active status in ddb and assigning position in mosaic")
#         mosaic_info = get_event_mosaic_info(ddb_partition_key)
#         position = assign_position(ddb_partition_key, mosaic_info["available_positions"]["L"])
#         result = enable_submission_in_ddb(ddb_partition_key, ddb_sort_key, position)
#         if (result == 200):
#             logger.info("Successfully updated active status and position of {} > {}".format(ddb_partition_key, ddb_partition_key))
#         else:
#             logger.error("Unsucessful attempt at updating active status of {}".format(ddb_partition_key))
#     else:
#         logger.info("Found inappropriate immage, nothing to update in ddb.")
    #     logger.info("Found inappropriate immage, nothing to update in ddb.")
    # mosaic_info = get_event_mosaic_position_info("northeastern2024")
    # print(mosaic_info)
    # update_available_positions("northeastern2024", [])