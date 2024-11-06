class AssetManager {
    private static clubsCards = new Map<string, string>([
        ["cu", "assets/black_white/640_384.png"],
        ["c7", "assets/black_white/384_0.png"],
        ["c8", "assets/black_white/448_0.png"],
        ["c9", "assets/black_white/512_0.png"],
        ["cx", "assets/black_white/576_0.png"],
        ["c1", "assets/black_white/0_0.png"],
        ["cv", "assets/black_white/640_0.png"],
        ["cd", "assets/black_white/704_0.png"],
        ["cr", "assets/black_white/768_0.png"]
    ])
    private static spadeCards = new Map<string, string>([
        ["su", "assets/black_white/512_384.png"],
        ["s7", "assets/black_white/384_192.png"],
        ["s8", "assets/black_white/448_192.png"],
        ["s9", "assets/black_white/512_192.png"],
        ["sx", "assets/black_white/576_192.png"],
        ["s1", "assets/black_white/0_192.png"],
        ["sv", "assets/black_white/640_192.png"],
        ["sd", "assets/black_white/704_192.png"],
        ["sr", "assets/black_white/768_192.png"]
    ])
    private static heartCards = new Map<string, string>([
        ["hu", "assets/black_red/576_384.png"],
        ["h7", "assets/black_red/384_96.png"],
        ["h8", "assets/black_red/448_96.png"],
        ["h9", "assets/black_red/512_96.png"],
        ["hx", "assets/black_red/576_96.png"],
        ["h1", "assets/black_red/0_96.png"],
        ["hv", "assets/black_red/640_96.png"],
        ["hd", "assets/black_red/704_96.png"],
        ["hr", "assets/black_red/768_96.png"]
    ])
    private static diamondCards = new Map<string, string>([
        ["du", "assets/black_red/704_384.png"],
        ["d7", "assets/black_red/384_288.png"],
        ["d8", "assets/black_red/448_288.png"],
        ["d9", "assets/black_red/512_288.png"],
        ["dx", "assets/black_red/576_288.png"],
        ["d1", "assets/black_red/0_288.png"],
        ["dv", "assets/black_red/640_288.png"],
        ["dd", "assets/black_red/704_288.png"],
        ["dr", "assets/black_red/768_288.png"]
    ])
    private static suitlessCards = new Map<string, string>([
        ["alltrump", "assets/256_384.png"],
        ["notrump", "assets/0_384.png"],
        ["uu", "assets/768_384.png"]
    ])

    public static Get(input: string): string {
        let output: string | undefined;
        if (input == 'alltrump') output = AssetManager.suitlessCards.get("alltrump");
        else if (input == 'notrump') output = AssetManager.suitlessCards.get("notrump");
        else switch (input[0]) {
            case 'u': output = AssetManager.suitlessCards.get(input); break;
            case 'h': output = AssetManager.heartCards.get(input); break;
            case 'c': output = AssetManager.clubsCards.get(input); break;
            case 's': output = AssetManager.spadeCards.get(input); break;
            case 'd': output = AssetManager.diamondCards.get(input); break;
        }

        if (output == undefined) throw console.trace()
        else return output
    }
}