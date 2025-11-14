import { useState } from "react";
import { format } from "date-fns";
import { toZonedTime, formatInTimeZone } from "date-fns-tz";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Globe, Trash, Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import Calendar from "../calendar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

interface TimeZoneInfo {
  timezone: string;
  time: Date;
  offset: string;
}

const COUNTRIES_TIMEZONES = [
  { country: "🇦🇫 Afghanistan", timezone: "Asia/Kabul" },
  { country: "🇦🇱 Albania", timezone: "Europe/Tirane" },
  { country: "🇩🇿 Algeria", timezone: "Africa/Algiers" },
  { country: "🇦🇩 Andorra", timezone: "Europe/Andorra" },
  { country: "🇦🇴 Angola", timezone: "Africa/Luanda" },
  { country: "🇦🇬 Antigua și Barbuda", timezone: "America/Antigua" },
  { country: "🇦🇷 Argentina", timezone: "America/Argentina/Buenos_Aires" },
  { country: "🇦🇲 Armenia", timezone: "Asia/Yerevan" },
  { country: "🇦🇺 Australia - Sydney", timezone: "Australia/Sydney" },
  { country: "🇦🇺 Australia - Melbourne", timezone: "Australia/Melbourne" },
  { country: "🇦🇺 Australia - Brisbane", timezone: "Australia/Brisbane" },
  { country: "🇦🇺 Australia - Perth", timezone: "Australia/Perth" },
  { country: "🇦🇺 Australia - Adelaide", timezone: "Australia/Adelaide" },
  { country: "🇦🇹 Austria", timezone: "Europe/Vienna" },
  { country: "🇦🇿 Azerbaijan", timezone: "Asia/Baku" },
  { country: "🇧🇸 Bahamas", timezone: "America/Nassau" },
  { country: "🇧🇭 Bahrain", timezone: "Asia/Bahrain" },
  { country: "🇧🇩 Bangladesh", timezone: "Asia/Dhaka" },
  { country: "🇧🇧 Barbados", timezone: "America/Barbados" },
  { country: "🇧🇾 Belarus", timezone: "Europe/Minsk" },
  { country: "🇧🇪 Belgia", timezone: "Europe/Brussels" },
  { country: "🇧🇿 Belize", timezone: "America/Belize" },
  { country: "🇧🇯 Benin", timezone: "Africa/Porto-Novo" },
  { country: "🇧🇲 Bermuda", timezone: "Atlantic/Bermuda" },
  { country: "🇧🇹 Bhutan", timezone: "Asia/Thimphu" },
  { country: "🇧🇴 Bolivia", timezone: "America/La_Paz" },
  { country: "🇧🇦 Bosnia și Herțegovina", timezone: "Europe/Sarajevo" },
  { country: "🇧🇼 Botswana", timezone: "Africa/Gaborone" },
  { country: "🇧🇷 Brazilia - São Paulo", timezone: "America/Sao_Paulo" },
  { country: "🇧🇷 Brazilia - Rio de Janeiro", timezone: "America/Sao_Paulo" },
  { country: "🇧🇷 Brazilia - Manaus", timezone: "America/Manaus" },
  { country: "🇧🇳 Brunei", timezone: "Asia/Brunei" },
  { country: "🇧🇬 Bulgaria", timezone: "Europe/Sofia" },
  { country: "🇧🇫 Burkina Faso", timezone: "Africa/Ouagadougou" },
  { country: "🇧🇮 Burundi", timezone: "Africa/Bujumbura" },
  { country: "🇰🇭 Cambodgia", timezone: "Asia/Phnom_Penh" },
  { country: "🇨🇲 Camerun", timezone: "Africa/Douala" },
  { country: "🇨🇦 Canada - Toronto", timezone: "America/Toronto" },
  { country: "🇨🇦 Canada - Vancouver", timezone: "America/Vancouver" },
  { country: "🇨🇦 Canada - Montreal", timezone: "America/Montreal" },
  { country: "🇨🇻 Cabo Verde", timezone: "Atlantic/Cape_Verde" },
  { country: "🇨🇫 Republica Centrafricană", timezone: "Africa/Bangui" },
  { country: "🇹🇩 Ciad", timezone: "Africa/Ndjamena" },
  { country: "🇨🇱 Chile", timezone: "America/Santiago" },
  { country: "🇨🇳 China", timezone: "Asia/Shanghai" },
  { country: "🇨🇴 Columbia", timezone: "America/Bogota" },
  { country: "🇰🇲 Comore", timezone: "Indian/Comoro" },
  { country: "🇨🇬 Congo", timezone: "Africa/Brazzaville" },
  { country: "🇨🇷 Costa Rica", timezone: "America/Costa_Rica" },
  { country: "🇭🇷 Croația", timezone: "Europe/Zagreb" },
  { country: "🇨🇺 Cuba", timezone: "America/Havana" },
  { country: "🇨🇾 Cipru", timezone: "Asia/Nicosia" },
  { country: "🇨🇿 Cehia", timezone: "Europe/Prague" },
  { country: "🇩🇰 Danemarca", timezone: "Europe/Copenhagen" },
  { country: "🇩🇯 Djibouti", timezone: "Africa/Djibouti" },
  { country: "🇩🇲 Dominica", timezone: "America/Dominica" },
  { country: "🇩🇴 Republica Dominicană", timezone: "America/Santo_Domingo" },
  { country: "🇪🇨 Ecuador", timezone: "America/Guayaquil" },
  { country: "🇪🇬 Egipt", timezone: "Africa/Cairo" },
  { country: "🇸🇻 El Salvador", timezone: "America/El_Salvador" },
  { country: "🇬🇶 Guineea Ecuatorială", timezone: "Africa/Malabo" },
  { country: "🇪🇪 Estonia", timezone: "Europe/Tallinn" },
  { country: "🇪🇹 Etiopia", timezone: "Africa/Addis_Ababa" },
  { country: "🇫🇯 Fiji", timezone: "Pacific/Fiji" },
  { country: "🇫🇮 Finlanda", timezone: "Europe/Helsinki" },
  { country: "🇫🇷 Franța", timezone: "Europe/Paris" },
  { country: "🇬🇦 Gabon", timezone: "Africa/Libreville" },
  { country: "🇬🇲 Gambia", timezone: "Africa/Banjul" },
  { country: "🇬🇪 Georgia", timezone: "Asia/Tbilisi" },
  { country: "🇩🇪 Germania", timezone: "Europe/Berlin" },
  { country: "🇬🇭 Ghana", timezone: "Africa/Accra" },
  { country: "🇬🇷 Grecia", timezone: "Europe/Athens" },
  { country: "🇬🇩 Grenada", timezone: "America/Grenada" },
  { country: "🇬🇹 Guatemala", timezone: "America/Guatemala" },
  { country: "🇬🇳 Guineea", timezone: "Africa/Conakry" },
  { country: "🇬🇼 Guineea-Bissau", timezone: "Africa/Bissau" },
  { country: "🇬🇾 Guyana", timezone: "America/Guyana" },
  { country: "🇭🇹 Haiti", timezone: "America/Port-au-Prince" },
  { country: "🇭🇳 Honduras", timezone: "America/Tegucigalpa" },
  { country: "🇭🇰 Hong Kong", timezone: "Asia/Hong_Kong" },
  { country: "🇭🇺 Ungaria", timezone: "Europe/Budapest" },
  { country: "🇮🇸 Islanda", timezone: "Atlantic/Reykjavik" },
  { country: "🇮🇳 India", timezone: "Asia/Kolkata" },
  { country: "🇮🇩 Indonezia - Jakarta", timezone: "Asia/Jakarta" },
  { country: "🇮🇩 Indonezia - Bali", timezone: "Asia/Makassar" },
  { country: "🇮🇷 Iran", timezone: "Asia/Tehran" },
  { country: "🇮🇶 Irak", timezone: "Asia/Baghdad" },
  { country: "🇮🇪 Irlanda", timezone: "Europe/Dublin" },
  { country: "🇮🇱 Israel", timezone: "Asia/Jerusalem" },
  { country: "🇮🇹 Italia", timezone: "Europe/Rome" },
  { country: "🇯🇲 Jamaica", timezone: "America/Jamaica" },
  { country: "🇯🇵 Japonia", timezone: "Asia/Tokyo" },
  { country: "🇯🇴 Iordania", timezone: "Asia/Amman" },
  { country: "🇰🇿 Kazahstan", timezone: "Asia/Almaty" },
  { country: "🇰🇪 Kenya", timezone: "Africa/Nairobi" },
  { country: "🇰🇮 Kiribati", timezone: "Pacific/Tarawa" },
  { country: "🇰🇵 Coreea de Nord", timezone: "Asia/Pyongyang" },
  { country: "🇰🇷 Coreea de Sud", timezone: "Asia/Seoul" },
  { country: "🇰🇼 Kuwait", timezone: "Asia/Kuwait" },
  { country: "🇰🇬 Kârgâzstan", timezone: "Asia/Bishkek" },
  { country: "🇱🇦 Laos", timezone: "Asia/Vientiane" },
  { country: "🇱🇻 Letonia", timezone: "Europe/Riga" },
  { country: "🇱🇧 Liban", timezone: "Asia/Beirut" },
  { country: "🇱🇸 Lesotho", timezone: "Africa/Maseru" },
  { country: "🇱🇷 Liberia", timezone: "Africa/Monrovia" },
  { country: "🇱🇾 Libia", timezone: "Africa/Tripoli" },
  { country: "🇱🇮 Liechtenstein", timezone: "Europe/Vaduz" },
  { country: "🇱🇹 Lituania", timezone: "Europe/Vilnius" },
  { country: "🇱🇺 Luxemburg", timezone: "Europe/Luxembourg" },
  { country: "🇲🇴 Macao", timezone: "Asia/Macau" },
  { country: "🇲🇬 Madagascar", timezone: "Indian/Antananarivo" },
  { country: "🇲🇼 Malawi", timezone: "Africa/Blantyre" },
  { country: "🇲🇾 Malaysia - Kuala Lumpur", timezone: "Asia/Kuala_Lumpur" },
  { country: "🇲🇾 Malaysia - Kuching", timezone: "Asia/Kuching" },
  { country: "🇲🇻 Maldive", timezone: "Indian/Maldives" },
  { country: "🇲🇱 Mali", timezone: "Africa/Bamako" },
  { country: "🇲🇹 Malta", timezone: "Europe/Malta" },
  { country: "🇲🇭 Insulele Marshall", timezone: "Pacific/Majuro" },
  { country: "🇲🇷 Mauritania", timezone: "Africa/Nouakchott" },
  { country: "🇲🇺 Mauritius", timezone: "Indian/Mauritius" },
  { country: "🇲🇽 Mexic - Mexico City", timezone: "America/Mexico_City" },
  { country: "🇲🇽 Mexic - Cancun", timezone: "America/Cancun" },
  { country: "🇫🇲 Micronezia", timezone: "Pacific/Pohnpei" },
  { country: "🇲🇩 Moldova", timezone: "Europe/Chisinau" },
  { country: "🇲🇨 Monaco", timezone: "Europe/Monaco" },
  { country: "🇲🇳 Mongolia", timezone: "Asia/Ulaanbaatar" },
  { country: "🇲🇪 Muntenegru", timezone: "Europe/Podgorica" },
  { country: "🇲🇦 Maroc", timezone: "Africa/Casablanca" },
  { country: "🇲🇿 Mozambic", timezone: "Africa/Maputo" },
  { country: "🇲🇲 Myanmar", timezone: "Asia/Yangon" },
  { country: "🇳🇦 Namibia", timezone: "Africa/Windhoek" },
  { country: "🇳🇷 Nauru", timezone: "Pacific/Nauru" },
  { country: "🇳🇵 Nepal", timezone: "Asia/Kathmandu" },
  { country: "🇳🇱 Olanda", timezone: "Europe/Amsterdam" },
  { country: "🇳🇿 Noua Zeelandă", timezone: "Pacific/Auckland" },
  { country: "🇳🇮 Nicaragua", timezone: "America/Managua" },
  { country: "🇳🇪 Niger", timezone: "Africa/Niamey" },
  { country: "🇳🇬 Nigeria", timezone: "Africa/Lagos" },
  { country: "🇳🇴 Norvegia", timezone: "Europe/Oslo" },
  { country: "🇴🇲 Oman", timezone: "Asia/Muscat" },
  { country: "🇵🇰 Pakistan", timezone: "Asia/Karachi" },
  { country: "🇵🇼 Palau", timezone: "Pacific/Palau" },
  { country: "🇵🇸 Palestina", timezone: "Asia/Gaza" },
  { country: "🇵🇦 Panama", timezone: "America/Panama" },
  { country: "🇵🇬 Papua Noua Guinee", timezone: "Pacific/Port_Moresby" },
  { country: "🇵🇾 Paraguay", timezone: "America/Asuncion" },
  { country: "🇵🇪 Peru", timezone: "America/Lima" },
  { country: "🇵🇭 Filipine", timezone: "Asia/Manila" },
  { country: "🇵🇱 Polonia", timezone: "Europe/Warsaw" },
  { country: "🇵🇹 Portugalia", timezone: "Europe/Lisbon" },
  { country: "🇵🇷 Puerto Rico", timezone: "America/Puerto_Rico" },
  { country: "🇶🇦 Qatar", timezone: "Asia/Qatar" },
  { country: "🇷🇴 România", timezone: "Europe/Bucharest" },
  { country: "🇷🇺 Rusia - Moscova", timezone: "Europe/Moscow" },
  { country: "🇷🇺 Rusia - Vladivostok", timezone: "Asia/Vladivostok" },
  { country: "🇷🇼 Rwanda", timezone: "Africa/Kigali" },
  { country: "🇼🇸 Samoa", timezone: "Pacific/Apia" },
  { country: "🇸🇲 San Marino", timezone: "Europe/San_Marino" },
  { country: "🇸🇦 Arabia Saudită", timezone: "Asia/Riyadh" },
  { country: "🇸🇳 Senegal", timezone: "Africa/Dakar" },
  { country: "🇷🇸 Serbia", timezone: "Europe/Belgrade" },
  { country: "🇸🇨 Seychelles", timezone: "Indian/Mahe" },
  { country: "🇸🇱 Sierra Leone", timezone: "Africa/Freetown" },
  { country: "🇸🇬 Singapore", timezone: "Asia/Singapore" },
  { country: "🇸🇰 Slovacia", timezone: "Europe/Bratislava" },
  { country: "🇸🇮 Slovenia", timezone: "Europe/Ljubljana" },
  { country: "🇸🇧 Insulele Solomon", timezone: "Pacific/Guadalcanal" },
  { country: "🇸🇴 Somalia", timezone: "Africa/Mogadishu" },
  { country: "🇿🇦 Africa de Sud", timezone: "Africa/Johannesburg" },
  { country: "🇸🇸 Sudanul de Sud", timezone: "Africa/Juba" },
  { country: "🇪🇸 Spania", timezone: "Europe/Madrid" },
  { country: "🇱🇰 Sri Lanka", timezone: "Asia/Colombo" },
  { country: "🇸🇩 Sudan", timezone: "Africa/Khartoum" },
  { country: "🇸🇷 Surinam", timezone: "America/Paramaribo" },
  { country: "🇸🇪 Suedia", timezone: "Europe/Stockholm" },
  { country: "🇨🇭 Elveția", timezone: "Europe/Zurich" },
  { country: "🇸🇾 Siria", timezone: "Asia/Damascus" },
  { country: "🇹🇼 Taiwan", timezone: "Asia/Taipei" },
  { country: "🇹🇯 Tadjikistan", timezone: "Asia/Dushanbe" },
  { country: "🇹🇿 Tanzania", timezone: "Africa/Dar_es_Salaam" },
  { country: "🇹🇭 Thailanda", timezone: "Asia/Bangkok" },
  { country: "🇹🇱 Timor de Est", timezone: "Asia/Dili" },
  { country: "🇹🇬 Togo", timezone: "Africa/Lome" },
  { country: "🇹🇴 Tonga", timezone: "Pacific/Tongatapu" },
  { country: "🇹🇹 Trinidad și Tobago", timezone: "America/Port_of_Spain" },
  { country: "🇹🇳 Tunisia", timezone: "Africa/Tunis" },
  { country: "🇹🇷 Turcia", timezone: "Europe/Istanbul" },
  { country: "🇹🇲 Turkmenistan", timezone: "Asia/Ashgabat" },
  { country: "🇹🇻 Tuvalu", timezone: "Pacific/Funafuti" },
  { country: "🇺🇬 Uganda", timezone: "Africa/Kampala" },
  { country: "🇺🇦 Ucraina", timezone: "Europe/Kiev" },
  { country: "🇦🇪 Emiratele Arabe Unite", timezone: "Asia/Dubai" },
  { country: "🇬🇧 Marea Britanie", timezone: "Europe/London" },
  { country: "🇺🇸 SUA - New York", timezone: "America/New_York" },
  { country: "🇺🇸 SUA - Los Angeles", timezone: "America/Los_Angeles" },
  { country: "🇺🇸 SUA - Chicago", timezone: "America/Chicago" },
  { country: "🇺🇸 SUA - Denver", timezone: "America/Denver" },
  { country: "🇺🇸 SUA - Phoenix", timezone: "America/Phoenix" },
  { country: "🇺🇸 SUA - Honolulu", timezone: "Pacific/Honolulu" },
  { country: "🇺🇾 Uruguay", timezone: "America/Montevideo" },
  { country: "🇺🇿 Uzbekistan", timezone: "Asia/Tashkent" },
  { country: "🇻🇺 Vanuatu", timezone: "Pacific/Efate" },
  { country: "🇻🇦 Vatican", timezone: "Europe/Vatican" },
  { country: "🇻🇪 Venezuela", timezone: "America/Caracas" },
  { country: "🇻🇳 Vietnam", timezone: "Asia/Ho_Chi_Minh" },
  { country: "🇾🇪 Yemen", timezone: "Asia/Aden" },
  { country: "🇿🇲 Zambia", timezone: "Africa/Lusaka" },
  { country: "🇿🇼 Zimbabwe", timezone: "Africa/Harare" },
];

export default function TimeConverter() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTimeZones, setSelectedTimeZones] = useState<string[]>(
    "Europe/London,Asia/Tokyo".split(",")
  );
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const [sourceTimezone, setSourceTimezone] = useState("Europe/Bucharest");
  const [sourceTime, setSourceTime] = useState("20:00");
  const [openSourceTz, setOpenSourceTz] = useState(false);
  const [searchSourceTz, setSearchSourceTz] = useState("");

  const handleDateChange = (value: Date | null | undefined) => {
    if (value instanceof Date && !isNaN(value.getTime())) {
      setSelectedDate(value);
    }
  };

  const handleAddTimeZone = (tz: string) => {
    if (!selectedTimeZones.includes(tz)) {
      setSelectedTimeZones([...selectedTimeZones, tz]);
    }
    setOpen(false);
    setSearchValue("");
  };

  const handleRemoveTimeZone = (tz: string) => {
    setSelectedTimeZones(selectedTimeZones.filter((t) => t !== tz));
  };

  const getTimeInZones = (): TimeZoneInfo[] => {
    return selectedTimeZones.map((tz) => {
      const convertedTime = toZonedTime(selectedDate, tz);
      const offset = formatInTimeZone(convertedTime, tz, "xxx");

      return {
        timezone: tz,
        time: convertedTime,
        offset,
      };
    });
  };

  const calculateRomaniaTime = () => {
    const [hours, minutes] = sourceTime.split(":").map(Number);
    const sourceDate = new Date();
    sourceDate.setHours(hours, minutes, 0, 0);

    const sourceZonedTime = toZonedTime(sourceDate, sourceTimezone);
    const romaniaTime = toZonedTime(sourceZonedTime, "Europe/Bucharest");

    return {
      sourceTime: format(sourceZonedTime, "HH:mm"),
      romaniaTime: format(romaniaTime, "HH:mm"),
      sourceTimezone,
      sourceDate: format(sourceZonedTime, "EEEE, MMMM d"),
      romaniaDate: format(romaniaTime, "EEEE, MMMM d"),
    };
  };

  const timeInZones = getTimeInZones();
  const formattedDate = format(selectedDate, "yyyy-MM-dd");
  const formattedTime = format(selectedDate, "HH:mm");
  const reverseCalculation = calculateRomaniaTime();

  const filteredSourceTimezones = COUNTRIES_TIMEZONES.filter(
    (tz) =>
      tz.country.toLowerCase().includes(searchSourceTz.toLowerCase()) ||
      tz.timezone.toLowerCase().includes(searchSourceTz.toLowerCase())
  );

  return (
    <div className="max-h-[90dvh] overflow-y-auto w-full p-2 flex items-start justify-center">
      <div className="w-full space-y-5">
        <div className="text-center">
          <h1 className="text-2xl font-bold flex items-center justify-center gap-2">
            <Globe className="w-8 h-8" />
            Time Zone Converter
          </h1>
        </div>


        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle>🇷🇴 What time is it in Romania?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Select Source Country */}
              <div className="flex flex-col gap-2">
                <Label className="text-sm font-medium">
                  Select a country
                </Label>
                <Popover
                  open={openSourceTz}
                  onOpenChange={setOpenSourceTz}
                >
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openSourceTz}
                      className="w-full justify-between"
                    >
                      {COUNTRIES_TIMEZONES.find(
                        (tz) => tz.timezone === sourceTimezone
                      )?.country || "Select country..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput
                        placeholder="Search country..."
                        value={searchSourceTz}
                        onValueChange={setSearchSourceTz}
                      />
                      <CommandEmpty>No country found.</CommandEmpty>
                      <CommandList>
                        <CommandGroup>
                          {filteredSourceTimezones.map((tz) => (
                            <CommandItem
                              key={tz.country}
                              value={tz.country}
                              onSelect={() => {
                                setSourceTimezone(tz.timezone);
                                setOpenSourceTz(false);
                                setSearchSourceTz("");
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  sourceTimezone === tz.timezone
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {tz.country}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              <div className="flex flex-col gap-2">
                <Label className="text-sm font-medium">Time (24h format)</Label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    min="0"
                    max="23"
                    value={sourceTime.split(":")[0]}
                    onChange={(e) => {
                      const hours = e.target.value.padStart(2, "0");
                      const minutes = sourceTime.split(":")[1];
                      setSourceTime(`${hours}:${minutes}`);
                    }}
                    className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring text-center"
                    placeholder="HH"
                  />
                  <span className="flex items-center">:</span>
                  <Input
                    type="number"
                    min="0"
                    max="59"
                    value={sourceTime.split(":")[1]}
                    onChange={(e) => {
                      const hours = sourceTime.split(":")[0];
                      const minutes = e.target.value.padStart(2, "0");
                      setSourceTime(`${hours}:${minutes}`);
                    }}
                    className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring text-center"
                    placeholder="MM"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <div className="p-4 rounded-lg border bg-background">
                <p className="text-sm font-medium">
                  {
                    COUNTRIES_TIMEZONES.find(
                      (tz) => tz.timezone === sourceTimezone
                    )?.country
                  }
                </p>
                <p className="text-xl font-bold mt-2 text-primary">
                  {reverseCalculation.sourceTime}
                </p>
                <p className="text-sm mt-1">
                  {reverseCalculation.sourceDate}
                </p>
              </div>

              <div className="p-2 rounded-lg border border-primary bg-background">
                <p className="text-sm font-medium text-primary">
                  🇷🇴 România
                </p>
                <p className="text-3xl font-bold mt-2">
                  {reverseCalculation.romaniaTime}
                </p>
                <p className="text-sm  mt-1">
                  {reverseCalculation.romaniaDate}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle></CardTitle>
          </CardHeader>
          <CardContent className="flex items-start flex-col gap-3">
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="w-full flex items-center gap-3">
                <Label className="text-sm">Select Hour</Label>
                <Calendar
                  showTime
                  inline
                  selectionMode="single"
                  value={selectedDate}
                  onChange={(e) => handleDateChange(e as Date | null)}
                />
              </div>
              <div className="w-full flex flex-col gap-2">
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={open}
                      className="w-full justify-between"
                    >
                      Search time zone...
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput
                        placeholder="Search time zone..."
                        value={searchValue}
                        onValueChange={setSearchValue}
                      />
                      <CommandEmpty>No time zone found.</CommandEmpty>
                      <CommandList>
                        <CommandGroup>
                          {COUNTRIES_TIMEZONES.filter((tz) =>
                            tz.country
                              .toLowerCase()
                              .includes(searchValue.toLowerCase())
                          ).map((tz) => (
                            <CommandItem
                              key={tz.country}
                              value={tz.country}
                              onSelect={() => handleAddTimeZone(tz.timezone)}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  selectedTimeZones.includes(tz.timezone)
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {tz.country}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <div className="w-full">
              <div className="bg-background p-4 rounded-lg">
                <p className="text-sm">
                  Selected:
                  <span className="font-semibold">
                    {" "}
                    {formattedDate} {formattedTime}
                  </span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Time Zones Result */}
        <Card className="shadow-xl overflow-y-auto max-h-[500px]">
          <CardHeader>
            <CardTitle>Time in Different Time Zones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {timeInZones.map((item) => (
                <div
                  key={item.timezone}
                  className="p-2 rounded-lg bg-background border hover:shadow-md transition relative"
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => handleRemoveTimeZone(item.timezone)}
                  >
                    <Trash className="w-4 h-4" />
                  </Button>
                  <p className="text-sm font-medium text-primary">
                    {item.timezone}
                  </p>
                  <p className="font-bold mt-2">{format(item.time, "HH:mm")}</p>
                  <p className="text-sm mt-1">
                    {format(item.time, "EEEE, MMMM d")}
                  </p>
                  <p className="text-xs mt-2">UTC {item.offset}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}