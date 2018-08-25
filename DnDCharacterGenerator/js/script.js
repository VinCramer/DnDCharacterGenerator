
/*start by loading in the relevant JSON files, which were modified based on the original files by github user BTMorton, available here: https://github.com/BTMorton/dnd-5e-srd/tree/master/json*/


var classJSON;

/*specify location of a JSON file*/
var classRequestURL ="../data/classes.json";


/*initialize request which will be used for loading all of the JSON files*/
var classRequest = new XMLHttpRequest();

/*we'll start by getting the 5e races as a JSON*/
classRequest.open('GET', classRequestURL);

/*specify we're loading a JSON object*/
classRequest.responseType = 'json';

/*try to find the file*/
classRequest.send();


/*when the data loads, store it in the appropriate var*/
classRequest.onload = function(){
    classJSON= classRequest.response;
}



/*specify location of a JSON file*/
var raceRequestURL ="../data/races.json";

/*initialize request which will be used for loading all of the JSON files*/
var raceRequest = new XMLHttpRequest();

/*we'll start by getting the 5e races as a JSON*/
raceRequest.open('GET', raceRequestURL);

/*specify we're loading a JSON object*/
raceRequest.responseType = 'json';

/*try to find the file*/
raceRequest.send();

/*var to access the 5e race JSON in our functions later*/
var raceJSON;

/*when the data loads, store it in the appropriate var*/
raceRequest.onload = function(){
    raceJSON= raceRequest.response;
    
}


var spellJSON;

var spellRequestURL ="../data/spells.json";

var spellJSONRequest = new XMLHttpRequest();

spellJSONRequest.open('GET',spellRequestURL);

spellJSONRequest.responseType='json';

spellJSONRequest.send();

spellJSONRequest.onload = function(){
    spellJSON = spellJSONRequest.response;
}








/*below are all fields that are empty when first loading the page, but will be filled with relevant info once the user has generated a character*/
var finalStatsPara = document.getElementById("final stats");

var finalClassPara = document.getElementById("final class");

var finalEquipmentPara = document.getElementById("final equipment");

var finalMagicItemsPara = document.getElementById("final magic items");

var finalSpellsPara = document.getElementById("final spells");

var proficiences = [];

var proficiency;

var level;

/*this section of code adds event listeners to each of the buttons for spells we defined in our html. This makes those buttons display their content when clicked and hide it when clicked again*/
var coll = document.getElementsByClassName("mainCollapsible");
    
var j;

for (j = 0; j < coll.length; j++) {
    coll[j].addEventListener("click", function() {
        this.classList.toggle("active");
        var content = this.nextElementSibling;
        if (content.style.display === "block") {
            content.style.display = "none";
        } 
        else {
            content.style.display = "block";
        }
    });
         
}


function generateChar(){
    
    var isMinStats = document.querySelector('input[name=stats]:checked').value;
    
    var charStats = generateStats(isMinStats);
    
    var race = document.getElementById('race').value;
    if(race=="rand"){
       race = randRace();
    }
    
    
    
    charStats = addRacialBonuses(charStats, race);
    
    var allStats = "";
    allStats+="Strength: " + charStats[0]+" ";
    allStats+="Dexterity: " + charStats[1]+" ";
    allStats+="Constitution: " + charStats[2]+" ";
    allStats+="Intelligence: " + charStats[3]+" ";
    allStats+="Wisdom: " + charStats[4]+" ";
    allStats+="Charisma: " + charStats[5]+" ";
    
    finalStatsPara.innerHTML=allStats;
    
    level = document.getElementById('level').value;
    if(level=="rand"){
        level=roll1d20();   
    }
    proficiency = getProficiency(level);
    
    

    
    
    /*the base class the user wants to play as*/
    baseClass = document.getElementById('baseclass').value;
    
    
    if(baseClass=="rand"){
        baseClass = generateClass();
    }
    
    finalClassPara.innerHTML=baseClass;  
    
    /*need this after assigning the base class when the base class is random, otherwise proficiences don't work*/
    addStatsToTable(charStats, baseClass);
    
    var hiddenList = document.getElementsByClassName("hidden");
    for(let val of hiddenList){
        val.style="display:inline";
    }
    
    
    document.getElementById("ac").innerHTML=findAC(baseClass, race, charStats[0], findScoreBonus(charStats[1]), findScoreBonus(charStats[2]), findScoreBonus(charStats[4]));
    
    document.getElementById("initiative").innerHTML=findInitiative(findScoreBonus(charStats[1]), baseClass, level, proficiency);
    document.getElementById("speed").innerHTML=findSpeed(race, baseClass, level);
    
    var health = findCharHealth(race, baseClass, level, findScoreBonus(charStats[2]));
    
    document.getElementById("health").innerHTML= health;
    document.getElementById("proficiency").innerHTML=proficiency;
    document.getElementById("passive perception").innerHTML=findPassivePerception(charStats[4]);
    
    document.getElementById("final race").innerHTML=race;
    document.getElementById("final level").innerHTML=level;
    
    var levelFeatures = [];
    levelFeatures.push(document.getElementById("lvl1"));
    levelFeatures.push(document.getElementById("lvl2"));
    levelFeatures.push(document.getElementById("lvl3"));
    levelFeatures.push(document.getElementById("lvl4"));
    levelFeatures.push(document.getElementById("lvl5"));
    levelFeatures.push(document.getElementById("lvl6"));
    levelFeatures.push(document.getElementById("lvl7"));
    levelFeatures.push(document.getElementById("lvl8"));
    levelFeatures.push(document.getElementById("lvl9"));
    levelFeatures.push(document.getElementById("lvl10"));
    levelFeatures.push(document.getElementById("lvl11"));
    levelFeatures.push(document.getElementById("lvl12"));
    levelFeatures.push(document.getElementById("lvl13"));
    levelFeatures.push(document.getElementById("lvl14"));
    levelFeatures.push(document.getElementById("lvl15"));
    levelFeatures.push(document.getElementById("lvl16"));
    levelFeatures.push(document.getElementById("lvl17"));
    levelFeatures.push(document.getElementById("lvl18"));
    levelFeatures.push(document.getElementById("lvl19"));
    levelFeatures.push(document.getElementById("lvl20"));
    
    resetLevelFeatures(levelFeatures);
    
    
    displayRace(race);
    displayClass(baseClass, level, levelFeatures);
    
    updateCollapsibles(baseClass, level);
}

function getProficiency(level){
    if(level=="rand"){
        level = roll1d20();   
    }
    
    if(level<=4){
        return 2;
    }
    else if(level<=8){
        return 3;    
    }
    else if(level<=12){
        return 4;        
    }
    else if(level<=16){
        return 5;  
    }
    return 6;
}

/*for each stat and affiliated saving throw/skill, we'll add those values to the table in the hmtl file*/
function addStatsToTable(arr, baseClass){
    addStrStats(arr, baseClass);
    addDexStats(arr, baseClass);
    addConStats(arr, baseClass);
    addIntStats(arr, baseClass);
    addWisStats(arr, baseClass);
    addChaStats(arr, baseClass);
}

/*finds the bonus from the given score. In D&D, there's an odd mechanic with stats in which the stat value isn't your bonus. Example: Someone with an 18 in strength doesn't have a +18 to their athletics check, but instead they have a +4.*/
function findScoreBonus(score){
    switch(score){
        case 1:
            return -5;
            break;
        
        case 2:
        case 3:
            return -4;
            break;
            
        case 4:
        case 5:
            return -3;
            break;
            
        case 6:
        case 7:
            return -2;
            break;
            
        case 8:
        case 9:
            return -1;
            break;
            
        case 10:
        case 11:
            return 0;
            break;
            
        case 12:
        case 13:
            return 1;
            break;
            
        case 14:
        case 15:
            return 2;
            break;
            
        case 16:
        case 17:
            return 3;
            break;
            
        case 18:
        case 19:
            return 4;
            break;
            
        case 20:
        case 21:
            return 5;
            break;
            
        case 22:
        case 23:
            return 6;
            break;
            
        case 24:
        case 25:
            return 7;
            break;
            
        case 26:
        case 27:
            return 8;
            break;
            
        case 28:
        case 29:
            return 9;
            break;
            
        case 30:
            return 10;
            break;
           }
}

function addSkillStyling(htmlElement, bonus){
    if(bonus>0){
        htmlElement.innerHTML="+"+bonus;
    }
    else{
        htmlElement.innerHTML=bonus;    
    }
}

function addStrStats(arr, baseClass){
    
    /*get the strength score from the array, and then find the stat bonus that score provides*/
    var score = arr[0];
    var bonus = findScoreBonus(score);
    
    /*find and change the elements we can without needing to do any math*/
    var tableScore = document.getElementById("str score");
    
    var tableBonus = document.getElementById("str bonus");
    
    tableScore.innerHTML=score;
    
    if(bonus<=0){
        tableBonus.innerHTML="("+bonus+")";
    }
    else if(bonus>0){
       tableBonus.innerHTML="(+"+bonus+")";
    }
    
    
    var tableStrSave = document.getElementById("str save");
    var tableAthletics = document.getElementById("athletics");
    
    var strSave = bonus;
    
    /*if the user is one of these classes at level 1, add their proficiency bonus to the save. */
    if(baseClass=="barbarian" || baseClass=="fighter" || baseClass=="monk" || baseClass=="ranger"){
       strSave+=proficiency;
    }
    
    /*if the user has at least 6 levels in paladin, they can add their charisma bonus to all saves. This if block does not account for multiclassing at the moment, and neither does the Monk's level 14 ability nor the rogue's level 15 ability. */
    if(baseClass=="paladin" && level>=6){
        var chaBonus = findScoreBonus(arr[5]);
        if(chaBonus<=0){
            strSave+=1;   
        }
        else{
            strSave+=chaBonus;
        }
    }
    
    /*add the values with a + or - in front to the table*/
    addSkillStyling(tableStrSave,strSave);
    
    addSkillStyling(tableAthletics,bonus);
}

function addDexStats(arr, baseClass){
    var score = arr[1];
    var bonus = findScoreBonus(score);
    
    var tableScore = document.getElementById("dex score");
    
    var tableBonus = document.getElementById("dex bonus");
    
    tableScore.innerHTML=score;
    
    if(bonus<=0){
        tableBonus.innerHTML="("+bonus+")";
    }
    else if(bonus>0){
       tableBonus.innerHTML="(+"+bonus+")";
    }
    
    
    var tableDexSave = document.getElementById("dex save");
    var tableAcrobatics = document.getElementById("acrobatics");
    var tableStealth = document.getElementById("stealth");
    
    var tableSleightOfHand = document.getElementById("sleight-of-hand");
    
    var dexSave = bonus;
        
    
    if(baseClass=="bard" || baseClass=="monk" || baseClass=="ranger" || baseClass=="rogue"){
       dexSave+=proficiency;
    }
    
    if(baseClass=="paladin" && level>=6){
        var chaBonus = findScoreBonus(arr[5]);
        if(chaBonus<=0){
            dexSave+=1;   
        }
        else{
            dexSave+=chaBonus;
        }
    }
    
    
    addSkillStyling(tableDexSave,dexSave);
    
    addSkillStyling(tableAcrobatics,bonus);
    addSkillStyling(tableStealth,bonus);
    addSkillStyling(tableSleightOfHand,bonus);
}


function addConStats(arr, baseClass){
    var score = arr[2];
    var bonus = findScoreBonus(score);
    
    var tableScore = document.getElementById("con score");
    
    var tableBonus = document.getElementById("con bonus");
    
    tableScore.innerHTML=score;
    
    if(bonus<=0){
        tableBonus.innerHTML="("+bonus+")";
    }
    else if(bonus>0){
       tableBonus.innerHTML="(+"+bonus+")";
    }
    
    
    var tableConSave = document.getElementById("con save");
    
    var conSave = bonus;
        
    
    if(baseClass=="barbarian" || baseClass=="fighter" || baseClass=="sorcerer" || (baseClass=="monk" && level>=14)){
       conSave+=proficiency;
    }
    
    if(baseClass=="paladin" && level>=6){
        var chaBonus = findScoreBonus(arr[5]);
        if(chaBonus<=0){
            conSave+=1;   
        }
        else{
            conSave+=chaBonus;
        }
    }
    
    
    addSkillStyling(tableConSave,conSave);  
}


function addIntStats(arr, baseClass){
    var score = arr[3];
    var bonus = findScoreBonus(score);
    
    var tableScore = document.getElementById("int score");
    
    var tableBonus = document.getElementById("int bonus");
    
    tableScore.innerHTML=score;
    
    if(bonus<=0){
        tableBonus.innerHTML="("+bonus+")";
    }
    else if(bonus>0){
       tableBonus.innerHTML="(+"+bonus+")";
    }
    
    
    var tableIntSave = document.getElementById("int save");
    var tableArcana = document.getElementById("arcana");
    var tableHistory = document.getElementById("history");
    var tableNature = document.getElementById("nature");
    var tableInvestigation = document.getElementById("investigation");
    var tableReligion = document.getElementById("religion");
    
    var intSave = bonus;
        
    
    if(baseClass=="druid" || baseClass=="rogue" || baseClass=="wizard" || (baseClass=="monk" && level>=14)){
       intSave+=proficiency;
    }
    if(baseClass=="paladin" && level>=6){
        var chaBonus = findScoreBonus(arr[5]);
        if(chaBonus<=0){
            intSave+=1;   
        }
        else{
            intSave+=chaBonus;
        }
    }
    
    
    addSkillStyling(tableIntSave,intSave);
    
    addSkillStyling(tableArcana,bonus);
    addSkillStyling(tableNature,bonus);
    addSkillStyling(tableHistory,bonus);
    addSkillStyling(tableInvestigation,bonus);
    addSkillStyling(tableReligion,bonus);
}

function addWisStats(arr, baseClass){
    var score = arr[4];
    var bonus = findScoreBonus(score);
    
    var tableScore = document.getElementById("wis score");
    
    var tableBonus = document.getElementById("wis bonus");
    
    tableScore.innerHTML=score;
    
    if(bonus<=0){
        tableBonus.innerHTML="("+bonus+")";
    }
    else if(bonus>0){
       tableBonus.innerHTML="(+"+bonus+")";
    }
    
    
    var tableWisSave = document.getElementById("wis save");
    var tableAnimalHandling = document.getElementById("animal handling");
    var tableInsight = document.getElementById("insight");
    var tableMedicine = document.getElementById("medicine");
    var tablePerception = document.getElementById("perception");
    var tableSurvival = document.getElementById("survival");
    
    var wisSave = bonus;
        
    
    if(baseClass=="cleric" || baseClass=="druid" || baseClass=="paladin" || baseClass=="warlock" || baseClass=="wizard" || 
       (baseClass=="monk" && level>=14) || (baseClass=="rogue" && level>=15)){
       wisSave+=proficiency;
    }
    
    if(baseClass=="paladin" && level>=6){
        var chaBonus = findScoreBonus(arr[5]);
        if(chaBonus<=0){
            wisSave+=1;   
        }
        else{
            wisSave+=chaBonus;
        }
    }
    
    
    addSkillStyling(tableWisSave,wisSave);
    
    addSkillStyling(tableAnimalHandling,bonus);
    addSkillStyling(tableInsight,bonus);
    addSkillStyling(tableMedicine,bonus);
    addSkillStyling(tablePerception,bonus);
    addSkillStyling(tableSurvival,bonus);
}

function addChaStats(arr, baseClass){
    var score = arr[5];
    var bonus = findScoreBonus(score);
    
    var tableScore = document.getElementById("cha score");
    
    var tableBonus = document.getElementById("cha bonus");
    
    tableScore.innerHTML=score;
    
    if(bonus<=0){
        tableBonus.innerHTML="("+bonus+")";
    }
    else if(bonus>0){
       tableBonus.innerHTML="(+"+bonus+")";
    }
    
    
    var tableChaSave = document.getElementById("cha save");
    var tablePerformance = document.getElementById("performance");
    var tablePersuasion = document.getElementById("persuasion");
    var tableDeception = document.getElementById("deception");
    var tableIntimidation = document.getElementById("intimidation");
    
    var chaSave = bonus;
        
    
    if(baseClass=="cleric" || baseClass=="paladin" || baseClass=="warlock" || baseClass=="sorcerer" || baseClass=="bard" || (baseClass=="monk" && level>=14)){
       chaSave+=proficiency;
    }
    if(baseClass=="paladin" && level>=6){
        var chaBonus = findScoreBonus(arr[5]);
        if(chaBonus<=0){
            chaSave+=1;   
        }
        else{
            chaSave+=chaBonus;
        }
    }
    
    
    addSkillStyling(tableChaSave,chaSave);
    
    addSkillStyling(tablePerformance,bonus);
    addSkillStyling(tablePersuasion,bonus);
    addSkillStyling(tableIntimidation,bonus);
    addSkillStyling(tableDeception,bonus);
}

function generateStats(isMinStats){
    /*the way the user wants to roll for stats*/
    var statMethod = document.getElementById('stats').value;

    
    
    if(statMethod=='4'){
       return stats4d6(isMinStats);
        
    }
    else if(statMethod=='3'){
        return stats3d6(isMinStats);
    }
    else{
        return stats1d20(isMinStats);
    }
}

/*roll 4d6, and take away the lowest value. This function will be called 6 times if that's what the user chose*/
function roll4d6(){
    var a = roll1d6();
    var b = roll1d6();
    var c = roll1d6();
    var d = roll1d6();
    
    return a+b+c+d-Math.min(a,b,c,d);
}

/*roll 3d6*/
function roll3d6(){
    
    var a = roll1d6();
    var b = roll1d6();
    var c = roll1d6();
    return a+b+c;
}

/*generate a number 1-6*/
function roll1d6(){
    return Math.floor(Math.random()*6+1);
}

/*generate a number 1-20*/
function roll1d20(){
    return Math.floor(Math.random()*20+1);
}

/*calls 4d6 minus lowest for all 6 stats*/
function stats4d6(isMinStats){
    while(true){
        var myStats=[];

        for(var i=0;i<6;i++){
            myStats.push(roll4d6());   
        }

        /*if the user put a minimum in place, we want to respect that. Just like in real life, we completely re-roll our results. This still works even if the user does not enter a value for the lowest possible stat total*/
        if(isMinStats=="minimum"){
            var min = document.getElementById("min val").value;
            var total=0;
            for(var i=0;i<myStats.length;i++){
                total+=myStats[i];
            }
            if(total>=min){
               return myStats;
               }
        }

        else{
            return myStats;
        }
    }
}

/*calls 3d6 for all 6 stats*/
function stats3d6(isMinStats){
    while(true){
        var myStats=[];

        for(var i=0;i<6;i++){
            myStats.push(roll3d6());
        }

        if(isMinStats=="minimum"){
                var min = document.getElementById("min val").value;
                var total=0;
                for(var i=0;i<myStats.length;i++){
                    total+=myStats[i];
                }
                if(total>=min){
                   return myStats;
                   }
            }

        else{
            return myStats;
        }
        
    }
    
}

/*calls 1d20 for all 6 stats*/
function stats1d20(isMinStats){
    while(true){
        var myStats=[];
    
        for(var i=0;i<6;i++){
            myStats.push(roll1d20());
        }
        if(isMinStats=="minimum"){
            var min = document.getElementById("min val").value;
            var total=0;
            for(var i=0;i<myStats.length;i++){
                total+=myStats[i];
            }
            if(total>=min){
               return myStats;
               }
        }

        else{
            return myStats;
        }
    }
}

function generateClass(){
    
    /*pick a class at random from the available 12*/
    var randClass = Math.floor(Math.random()*12);
    
    switch(randClass){
        case 0:
            return "barbarian";
        break;
        
        case 1:
            return "bard";
        break;
        
        case 2:
            return "cleric";
        break;
        
        case 3:
            return "druid";
        break;
        
        case 4:
            return "fighter";
        break;
        
        case 5:
            return "monk";
        break;
        
        case 6:
            return "paladin";
        break;
        
        case 7:
            return "ranger";
        break;
        
        case 8:
            return "rogue";
        break;
        
        case 9:
            return "sorcerer";
        break;
        
        case 10:
            return "warlock";
        break;
        
        case 11:
            return "wizard";
        break;
    }
}

/*shows the input for the minimum stat total*/
function showMinBox(){
    var hiddenList = document.getElementsByClassName("hidden_stats");
    for(let val of hiddenList){
        val.style="display:inline";
    }
}

/*hides the input for the minimum stat total*/
function hideMinBox(){
    var hiddenList = document.getElementsByClassName("hidden_stats");
    for(let val of hiddenList){
        val.style="display:hidden";
    }
}

/*uses helper functions to get the total amount of health for the character*/
function findCharHealth(race, baseClass, level, conMod){
    
    level = parseInt(level, 10);
    
    
    if(baseClass=="wizard" || baseClass=="sorcerer"){
        return getd6Health(level, conMod, baseClass, race);   
    }
    else if(baseClass=="barbarian"){
        return getd12Health(level, conMod, race);   
    }
    else if(baseClass=="paladin" || baseClass=="fighter" || baseClass=="ranger"){
        return getd10Health(level, conMod, race);        
    }
    else{
        return getd8Health(level, conMod, race);
    }
}

/*calculates the total health of a character with d12 hit die. The 1st level is always considered the max roll, i.e. 12 for a d12, + con mod. Other levels will consist of the average value of a d12 (7) + con mod*/
function getd12Health(level, conMod, race){
    
    if(race!="hilldwarf"){
        return (12+conMod)+((level-1)*(7+conMod));
    }
    else{
        return (12+conMod+1)+((level-1)*(7+conMod+1));
    }
    
}

/*calculates the total health of a character with d10 hit die. The 1st level is always considered the max roll, i.e. 10 for a d10, + con mod. Other levels will consist of the average value of a d10 (6) + con mod*/
function getd10Health(level, conMod, race){
    if(race!="hilldwarf"){
        return (10+conMod)+((level-1)*(6+conMod));
    }
    else{
        return (10+conMod+1)+((level-1)*(6+conMod+1));
    }
}

/*calculates the total health of a character with d8 hit die. The 1st level is always considered the max roll, i.e. 8 for a d8, + con mod. Other levels will consist of the average value of a d8 (5) + con mod*/
function getd8Health(level, conMod, race){
    if(race!="hilldwarf"){
        return (8+conMod)+((level-1)*(5+conMod));
    }
    else{
        return (8+conMod+1)+((level-1)*(5+conMod+1));
    }
}

/*calculates the total health of a character with d6 hit die. The 1st level is always considered the max roll, i.e. 6 for a d6, + con mod. Other levels will consist of the average value of a d6 (4) + con mod. If the class is a sorcerer, then we have to adjust the health, since the only 
srd sorcerer subclass gets a bonus to their health each level*/
function getd6Health(level, conMod, charClass, race){
    if(charClass=="wizard"){
        if(race!="hilldwarf"){
            return (6+conMod)+((level-1)*(4+conMod));
        }
        else{
            return (6+conMod+1)+((level-1)*(4+conMod+1));
        }
    }
    /*only other d6 hit die class is sorc*/
    else{
        if(race!="hilldwarf"){
            return (6+conMod+1)+((level-1)*(4+conMod+1));
        }
        else{
            return (6+conMod+2)+((level-1)*(4+conMod+2));
        }
    }
}

/*calculates initiative for the given character. For most cases in the SRD, the result is just a bonus equal to your dex bonus, i.e. 18 would be +4, and 9 would be -1. Bards have a bonus starting at level 2 due to Jack of all Trades, which adds half proficiency rounded down. Fighters (or at least, the only SRD fighter subclass, the Champion) can add half proficiency, rounding up starting at level 7.*/
function findInitiative(dexMod, charClass, level, proficiency){
    if(charClass != "bard" && charClass != "fighter"){
        if(dexMod<=0){
            return dexMod;
        }
        else{
            return "+" + dexMod;
        }
    }
    
    else{
        if(charClass=="bard" && level>=2){
            var initiative = dexMod + Math.floor(proficiency/2);
            if(initiative<=0){
               return initiative;
            }
            else{
               return "+" + initiative;
            }
        }
        else if(charClass == "bard"){
            if(dexMod<=0){
                return dexMod;
            }
            else{
                return "+" + dexMod;
            }    
        }
        
        /*must be a fighter*/
        else{
            if(level >=7){
                var initiative = dexMod + Math.ceil(proficiency/2);
                if(initiative<=0){
                    return initiative;
                }
                else{
                    return "+" + initiative;
                }
            }
            
            else{
                if(dexMod<=0){
                    return dexMod;
                }
                else{
                    return "+" + dexMod;
                }
            }
            
        }
    }
}

/*calculates passive perception of the character, which is equal to 10 + its perception bonus*/
function findPassivePerception(wisdom){
    var bonus = findScoreBonus(wisdom);
    /*TODO - deal with proficiency, jack of all trades, and expertise!*/
    return 10 + bonus;
}

/*calculates the speed stat of the character. Barbrians get +10 at level 5, and monks get certain bonuses as they level.*/
function findSpeed(race, charClass, level){
    var speed;
    if(race=="hilldwarf"){
        speed=25;
    }
    
    else{
        /*all other SRD races have this speed value*/
        speed=30;
    }
    
    if(charClass=="barbarian" && level > 5){
       return speed+10;
    }
    else if(charClass=="monk" && level > 1){
       if(level<=5){
          return speed+10;
        }
        else if(level<=9){
           return speed+15;
        }
        else if(level<=13){
            return speed+20;
        }
        else if(level<=17){
            return speed+25;    
        }
        else{
            return speed+30;
        }
    }
    else{
        return speed;
    }
}

/*finds the best armor class score for each class/race combo. For simplicity's sake, it's assumed that the best armor of light and medium are the available options. For clerics, fighters, and paladins, heavy is the best if they can wear it with no speed penalty, i.e. they meet the strength requirements or are dwarves. */
function findAC(charClass, race, str, dexMod, conMod, wisMod){
    
    /*draconic resilience > nothing*/
    if(charClass=="sorcerer"){
        return (13+dexMod)+" draconic resilience";   
    }
    
    /*must not wear armor to gain most class features*/
    if(charClass=="monk"){
       return (10+dexMod+wisMod) + " unarmored defense";
    }
    
    /*no armor prof*/
    if(charClass=="wizard"){
       return (10+dexMod) + " none";
    }
    
    /*light armor only*/
    if(charClass=="bard" || charClass=="warlock" || charClass=="rogue"){
       return (12+dexMod) + " studded leather";
    }
    
    /*medium and light proficiency*/
    if(charClass=="ranger" || charClass=="druid"){
        
        /*at max dex, they're the same, so we'll go with the light armor to avoid the stealth disadvantage*/
        if(dexMod==5){
            return 17 + " studded leather";
        }
        
        /*medium is better in other cases*/
        else{
            var ac;
            if(dexMod>=2){
                /*medium only allows a +2 dex bonus at most*/
                ac = 17;
            }
            else{
                ac = 15+dexMod;
            }
            return ac + " half plate";
        }
    }
    
    /*barbarians can use either unarmored defense, light armor, or medium armor*/
    if(charClass=="barbarian"){
        var unarmored = 10+conMod+dexMod;
        var light = 12+dexMod;
        var med;
        if(dexMod>=2){
            med=17;       
        }
        else{
            med=15+dexMod;   
        }
        
        /*we'll default to unarmored defense since it's the cheapest*/
        if(unarmored>=light && unarmored>=med){
           return unarmored+" unarmored defense";
        }
        
        /*we'll then prioritize light over medium to avoid the stealth disadvantage*/
        else if(light>=med){
           return light + " studded leather";
        }
        
        else{
            return med + " half plate";
        }
    }
    
    /*all other classes that can wear platemail*/
    else{
        
        /*we go through all 4 types of heavy armor to see if they're better/same as other armor types.*/
        if(str>=15 || race=="hilldwarf"){
            return 18 + " plate";
        }
        
        if((str>=17 || race=="hilldwarf") && dexMod<2){
            return 17 + " splint";   
        }
        
        if((str>=17 || race=="hilldwarf") && dexMod<1){
           return 16 + " chain mail";
        }
        
        
        if((str>=17 || race=="hilldwarf") && dexMod<0){
           return 16 + " ring mail";
        }
        
        var light = 12+dexMod;
        var med;
        if(dexMod>=2){
            med=17;       
        }
        else{
            med=15+dexMod;   
        }
        
        if(light>=med){
           return light + " studded leather";
        }
        else{
            return med + " half plate";
        }
        
    }
    
}

/*randomly generates a race for the user*/
function randRace(){
    var rand = Math.floor(Math.random()*9);
    switch(rand){
        case 0:
            return "dragonborn";
            break;
        case 1:
            return "halfelf";
            break;
        case 2:
            return "halforc";
            break;
        case 3:
            return "highelf";
            break;
        case 4:
            return "hilldwarf";
            break;
        case 5:
            return "human";
            break;
        case 6:
            return "lightfoothalfling";
            break;
        case 7:
            return "rockgnome";
            break;
        case 8:
            return "tiefling";
            break;
    }
}

/*adds the racial bonuses to the stats generated, provided the bonuses do not make a stat exceed 20.*/
function addRacialBonuses(charStats, race){
    /*
    charStats:
    [0] - strength
    [1] - dexterity
    [2] - constitution
    [3] - intelligence
    [4] - wisdom
    [5] - charisma
    */
    if(race=="dragonborn"){
        charStats[0]+=2;
        charStats[5]+=1;
    }
    else if(race=="halfelf"){
        charStats[5]+=2;
        /*TODO - fix choosing any 2 other stats for +1*/
        
    }
    else if(race=="halforc"){
        charStats[0]+=2;
        charStats[2]+=1;
    }
    else if(race=="highelf"){
        charStats[1]+=2;
        charStats[3]+=1;
    }
    else if(race=="hilldwarf"){
        charStats[2]+=2;
        charStats[4]+=1;
    }
    else if(race=="human"){
        for(var i=0;i<charStats.length;i++){
            charStats[i]+=1;
        }
    }
    else if(race=="lightfoothalfling"){
        charStats[2]+=1;
        charStats[5]+=1;
    }
    else if(race=="rockgnome"){
        charStats[3]+=2;
        charStats[2]+=1;
    }
    else if(race=="tiefling"){
        charStats[3]+=1;
        charStats[5]+=2;
    }
    
    /*Here we correct if any bonuses made a stat too high. For example, if the user chose to roll 1d20 for stats and rolled a 19 for Strength, then added the Dragonborn's strength bonus, rather than breaking the game by having a Strength of 21, the stat is lowered to 20.*/
    for(var i=0;i<charStats.length;i++){
        if(charStats[i]>20){
           charStats[i]=20;
        }
    }
    
    return charStats;
}

/*update an element of our HTLM depending on what race the user selected*/
function displayRace(race){
    var raceElement = document.getElementById("racial bonuses");
    var raceText="";
    
    raceElement.innerHTML="";
    
    if(race=="hilldwarf"){
        raceText+=raceJSON['Races']['Dwarf']['Dwarf Traits']['content'].join("<br>")+"<br><br>";   
        raceText+=raceJSON['Races']['Dwarf']['Dwarf Traits']['Hill Dwarf']['content'].join("<br>");
        
    }
    else if(race=="highelf"){
        raceText=raceJSON['Races']['Elf']['Elf Traits']['content'].join("<br>")+"<br><br>";
        raceText+=raceJSON['Races']['Elf']['Elf Traits']['High Elf']['content'].join("<br>");
    }
    else if(race=="lightfoothalfling"){
        raceText=raceJSON['Races']['Halfling']['Halfling Traits']['content'].join("<br>")+"<br><br>";
        raceText+=raceJSON['Races']['Halfling']['Halfling Traits']['Lightfoot']['content'].join("<br>");   
    }
    else if(race=="human"){
        raceText=raceJSON['Races']['Human']['Human Traits']['content'].join("<br>");    
    }
    else if(race=="dragonborn"){
        raceText+=raceJSON['Races']['Dragonborn']['Dragonborn Traits']['content'][0]+"<br>";
        raceText+=raceJSON['Races']['Dragonborn']['Dragonborn Traits']['content'][1]+"<br>";
        raceText+=raceJSON['Races']['Dragonborn']['Dragonborn Traits']['content'][2]+"<br>";
        raceText+=raceJSON['Races']['Dragonborn']['Dragonborn Traits']['content'][3]+"<br>";
        raceText+=raceJSON['Races']['Dragonborn']['Dragonborn Traits']['content'][4]+"<br>";
        raceText+=raceJSON['Races']['Dragonborn']['Dragonborn Traits']['content'][5]+"<br><br>";
        raceText+=raceJSON['Races']['Dragonborn']['Dragonborn Traits']['content'][6]+"<br>";
        
        raceElement.innerHTML=raceText;
        
        /*overwrite raceText to insert table in proper location*/
        raceText="<table>"+
        "<tr><th>Dragon</th><th>Damage Type</th><th>Breath Weapon</th></tr>"+
        "<tr>"+
        "<td>" + raceJSON['Races']['Dragonborn']['Dragonborn Traits']['content'][7]['table']['Dragon'][0] + "</td>"+
        "<td>" + raceJSON['Races']['Dragonborn']['Dragonborn Traits']['content'][7]['table']['Damage Type'][0] + "</td>"+
        "<td>" + raceJSON['Races']['Dragonborn']['Dragonborn Traits']['content'][7]['table']['Breath Weapon'][0] + "</td>"+
        "</tr>"+
        "<tr>"+
        "<td>" + raceJSON['Races']['Dragonborn']['Dragonborn Traits']['content'][7]['table']['Dragon'][1] + "</td>"+
        "<td>" + raceJSON['Races']['Dragonborn']['Dragonborn Traits']['content'][7]['table']['Damage Type'][1] + "</td>"+
        "<td>" + raceJSON['Races']['Dragonborn']['Dragonborn Traits']['content'][7]['table']['Breath Weapon'][1] + "</td>"+
        "</tr>"+
        "<tr>"+
        "<td>" + raceJSON['Races']['Dragonborn']['Dragonborn Traits']['content'][7]['table']['Dragon'][2] + "</td>"+
        "<td>" + raceJSON['Races']['Dragonborn']['Dragonborn Traits']['content'][7]['table']['Damage Type'][2] + "</td>"+
        "<td>" + raceJSON['Races']['Dragonborn']['Dragonborn Traits']['content'][7]['table']['Breath Weapon'][2] + "</td>"+
        "</tr>"+
        "<tr>"+
        "<td>" + raceJSON['Races']['Dragonborn']['Dragonborn Traits']['content'][7]['table']['Dragon'][3] + "</td>"+
        "<td>" + raceJSON['Races']['Dragonborn']['Dragonborn Traits']['content'][7]['table']['Damage Type'][3] + "</td>"+
        "<td>" + raceJSON['Races']['Dragonborn']['Dragonborn Traits']['content'][7]['table']['Breath Weapon'][3] + "</td>"+
        "</tr>"+
        "<tr>"+
        "<td>" + raceJSON['Races']['Dragonborn']['Dragonborn Traits']['content'][7]['table']['Dragon'][4] + "</td>"+
        "<td>" + raceJSON['Races']['Dragonborn']['Dragonborn Traits']['content'][7]['table']['Damage Type'][4] + "</td>"+
        "<td>" + raceJSON['Races']['Dragonborn']['Dragonborn Traits']['content'][7]['table']['Breath Weapon'][4] + "</td>"+
        "</tr>"+
        "<tr>"+
        "<td>" + raceJSON['Races']['Dragonborn']['Dragonborn Traits']['content'][7]['table']['Dragon'][5] + "</td>"+
        "<td>" + raceJSON['Races']['Dragonborn']['Dragonborn Traits']['content'][7]['table']['Damage Type'][5] + "</td>"+
        "<td>" + raceJSON['Races']['Dragonborn']['Dragonborn Traits']['content'][7]['table']['Breath Weapon'][5] + "</td>"+
        "</tr>"+
        "<tr>"+
        "<td>" + raceJSON['Races']['Dragonborn']['Dragonborn Traits']['content'][7]['table']['Dragon'][6] + "</td>"+
        "<td>" + raceJSON['Races']['Dragonborn']['Dragonborn Traits']['content'][7]['table']['Damage Type'][6] + "</td>"+
        "<td>" + raceJSON['Races']['Dragonborn']['Dragonborn Traits']['content'][7]['table']['Breath Weapon'][6] + "</td>"+
        "</tr>"+
        "<tr>"+
        "<td>" + raceJSON['Races']['Dragonborn']['Dragonborn Traits']['content'][7]['table']['Dragon'][7] + "</td>"+
        "<td>" + raceJSON['Races']['Dragonborn']['Dragonborn Traits']['content'][7]['table']['Damage Type'][7] + "</td>"+
        "<td>" + raceJSON['Races']['Dragonborn']['Dragonborn Traits']['content'][7]['table']['Breath Weapon'][7] + "</td>"+
        "</tr>"+
        "<tr>"+
        "<td>" + raceJSON['Races']['Dragonborn']['Dragonborn Traits']['content'][7]['table']['Dragon'][8] + "</td>"+
        "<td>" + raceJSON['Races']['Dragonborn']['Dragonborn Traits']['content'][7]['table']['Damage Type'][8] + "</td>"+
        "<td>" + raceJSON['Races']['Dragonborn']['Dragonborn Traits']['content'][7]['table']['Breath Weapon'][8] + "</td>"+
        "</tr>"+
        "<tr>"+
        "<td>" + raceJSON['Races']['Dragonborn']['Dragonborn Traits']['content'][7]['table']['Dragon'][9] + "</td>"+
        "<td>" + raceJSON['Races']['Dragonborn']['Dragonborn Traits']['content'][7]['table']['Damage Type'][9] + "</td>"+
        "<td>" + raceJSON['Races']['Dragonborn']['Dragonborn Traits']['content'][7]['table']['Breath Weapon'][9] + "</td>"+
        "</tr>"+
        "</table><br>";
        
        raceElement.innerHTML+=raceText;
        
        raceText=raceJSON['Races']['Dragonborn']['Dragonborn Traits']['content'][8]+"<br>";
        raceText+=raceJSON['Races']['Dragonborn']['Dragonborn Traits']['content'][9]+"<br>";
        raceText+=raceJSON['Races']['Dragonborn']['Dragonborn Traits']['content'][10]+"<br>";
        raceText+=raceJSON['Races']['Dragonborn']['Dragonborn Traits']['content'][11]+"<br>";
        raceText+=raceJSON['Races']['Dragonborn']['Dragonborn Traits']['content'][12]+"<br>";
        raceText+=raceJSON['Races']['Dragonborn']['Dragonborn Traits']['content'][13]+"<br>";
    }
    else if(race=="rockgnome"){
        raceText=raceJSON['Races']['Gnome']['Gnome Traits']['content'].join("<br>")+"<br><br>";
        raceText+=raceJSON['Races']['Gnome']['Gnome Traits']['Rock Gnome']['content'].join("<br>");
    }
    else if(race=="halfelf"){
        raceText=raceJSON['Races']['Half-Elf']['Half-Elf Traits']['content'].join("<br>");    
    }
    else if(race=="halforc"){
        raceText=raceJSON['Races']['Half-Orc']['Half-Orc Traits']['content'].join("<br>");    
    }
    
    /*other race must be tiefling*/
    else{
        raceText=raceJSON['Races']['Tiefling']['Tiefling Traits']['content'].join("<br>");
    }
    
    raceElement.innerHTML+=raceText;
    
}


/*update an element of our HTML depending on what class the user selected, as well as level.*/
function displayClass(charClass, level, levelFeatures){
    var classPara = document.getElementById("class features");
    var classText="";
    
    /*fill in boilerplate with the class name*/
    var classSpan = document.getElementById("charClass");
    classSpan.innerHTML=charClass;
    
    var basicFeatures = document.getElementById("basic features");
    var basicFeaturesString = "";
    
    var lvl1Features = "<b>Level 1 features:</b><br><br>";
    var lvl1Element=levelFeatures[0];
    
    var lvl2Features= "<b>Level 2 features:</b><br><br>";
    var lvl2Element=levelFeatures[1];
    
    var lvl3Features= "<b>Level 3 features:</b><br><br>";
    var lvl3Element=levelFeatures[2];
    
    var lvl4Features= "<b>Level 4 features:</b><br><br>";
    var lvl4Element=levelFeatures[3];
    
    var lvl5Features= "<b>Level 5 features:</b><br><br>";
    var lvl5Element=levelFeatures[4];
    
    var lvl6Features= "<b>Level 6 features:</b><br><br>";
    var lvl6Element=levelFeatures[5];
    
    var lvl7Features= "<b>Level 7 features:</b><br><br>";
    var lvl7Element=levelFeatures[6];
    
    var lvl8Features= "<b>Level 8 features:</b><br><br>";
    var lvl8Element=levelFeatures[7];
    
    var lvl9Features= "<b>Level 9 features:</b><br><br>";
    var lvl9Element=levelFeatures[8];
    
    var lvl10Features= "<b>Level 10 features:</b><br><br>";
    var lvl10Element=levelFeatures[9];
    
    var lvl11Features = "<b>Level 11 features:</b><br><br>";
    var lvl11Element=levelFeatures[10];
    
    var lvl12Features= "<b>Level 12 features:</b><br><br>";
    var lvl12Element=levelFeatures[11];
    
    var lvl13Features= "<b>Level 13 features:</b><br><br>";
    var lvl13Element=levelFeatures[12];
    
    var lvl14Features= "<b>Level 14 features:</b><br><br>";
    var lvl14Element=levelFeatures[13];
    
    var lvl15Features= "<b>Level 15 features:</b><br><br>";
    var lvl15Element=levelFeatures[14];
    
    var lvl16Features= "<b>Level 16 features:</b><br><br>";
    var lvl16Element=levelFeatures[15];
    
    var lvl17Features= "<b>Level 17 features:</b><br><br>";
    var lvl17Element=levelFeatures[16];
    
    var lvl18Features= "<b>Level 18 features:</b><br><br>";
    var lvl18Element=levelFeatures[17];
    
    var lvl19Features= "<b>Level 19 features:</b><br><br>";
    var lvl19Element=levelFeatures[18];
    
    var lvl20Features= "<b>Level 20 features:</b><br><br>";
    var lvl20Element=levelFeatures[19];
    
    if(charClass=="barbarian"){
        
        /*basic features for classes include hit points, proficiencies, and equipment*/
        basicFeaturesString+="<br><br>Hit Points: <br>" + classJSON['Barbarian']['Class Features']['Hit Points']['content'][0] + "<br>";
        basicFeaturesString+=classJSON['Barbarian']['Class Features']['Hit Points']['content'][1] + "<br>";
        basicFeaturesString+=classJSON['Barbarian']['Class Features']['Hit Points']['content'][2] + "<br><br>";
        basicFeaturesString+="Proficiences:<br>";
        basicFeaturesString+=classJSON['Barbarian']['Class Features']['Proficiencies']['content'][0]+"<br>";
        basicFeaturesString+=classJSON['Barbarian']['Class Features']['Proficiencies']['content'][1]+"<br>";
        basicFeaturesString+=classJSON['Barbarian']['Class Features']['Proficiencies']['content'][2]+"<br>";
        basicFeaturesString+=classJSON['Barbarian']['Class Features']['Proficiencies']['content'][3]+"<br>";
        basicFeaturesString+=classJSON['Barbarian']['Class Features']['Proficiencies']['content'][4]+" ";
        basicFeaturesString+=classJSON['Barbarian']['Class Features']['Proficiencies']['content'][5]+"<br><br>";
        basicFeaturesString+="Equipment:<br>";
        basicFeaturesString+=classJSON['Barbarian']['Class Features']['Equipment']['content'][0]+"<br>";
        basicFeaturesString+="- " + classJSON['Barbarian']['Class Features']['Equipment']['content'][1][0]+"<br>";
        basicFeaturesString+="- " + classJSON['Barbarian']['Class Features']['Equipment']['content'][1][1]+"<br>";
        basicFeaturesString+="- " + classJSON['Barbarian']['Class Features']['Equipment']['content'][1][2]+"<br>";
        
        
        basicFeatures.innerHTML=basicFeaturesString;

        
        var lvl1String="<br>";
        lvl1String+="<button class=\"collapsible\">Rage:</button><div class=\"content\">";
        lvl1String+="<br>"+classJSON['Barbarian']['Class Features']['Rage']['content'][0]+"<br>";
        lvl1String+="<br>"+classJSON['Barbarian']['Class Features']['Rage']['content'][1]+"<br>";
        lvl1String+="<br>"+classJSON['Barbarian']['Class Features']['Rage']['content'][2].join(" ")+"<br>";
        lvl1String+="<br>"+classJSON['Barbarian']['Class Features']['Rage']['content'][3]+"<br>";
        lvl1String+="<br>"+classJSON['Barbarian']['Class Features']['Rage']['content'][4]+"<br></div><br><br>";
        lvl1String+="<button class=\"collapsible\">Unarmored Defense:</button><div class=\"content\">";
        lvl1String+="<br>"+classJSON['Barbarian']['Class Features']['Unarmored Defense']+"</div><br><br>";
        

        document.getElementsByClassName("lvlContent")[0].innerHTML=lvl1String;
        
        if(level>=2){
            
            var lvl2String="<br>";
            lvl2String+="<button class=\"collapsible\">Reckless Attack:</button><div class=\"content\">";
            lvl2String+="<br>"+classJSON['Barbarian']['Class Features']['Reckless Attack']+"</div><br><br>";
            lvl2String+="<button class=\"collapsible\">Danger Sense:</button><div class=\"content\">";
            lvl2String+="<br>"+classJSON['Barbarian']['Class Features']['Danger Sense']['content'].join(" ")+"</div><br><br>";
        

            document.getElementsByClassName("lvlContent")[1].innerHTML=lvl2String;
        }
        
        if(level>=3){
            
            var lvl3String="<br>";
            lvl3String+="<button class=\"collapsible\">Primal Path:</button><div class=\"content\">";
            lvl3String+="<br>"+classJSON['Barbarian']['Class Features']['Primal Path']+"</div><br><br>";
            lvl3String+="<button class=\"collapsible\">Path of the Berserker:</button><div class=\"content\">";
            lvl3String+="<br>"+classJSON['Barbarian']['Class Features']['Path of the Berserker']['content']+"<br><br>";
            lvl3String+="<button class=\"collapsible\">Frenzy:</button><div class=\"content\">";
            lvl3String+="<br>"+classJSON['Barbarian']['Class Features']['Path of the Berserker']['Frenzy']+"</div><br><br></div><br><br>";
            
            document.getElementsByClassName("lvlContent")[2].innerHTML=lvl3String;
        }
        
        //use this string for levels 4, 8, 12, 16, and 19
        var asiString="<br><br>";
        asiString+="<button class=\"collapsible\">Ability Score Improvement:</button><div class=\"content\">";
        asiString+="<br>"+classJSON['Barbarian']['Class Features']['Ability Score Improvement']+"</div><br><br>";
        
        if(level>=4){
            document.getElementsByClassName("lvlContent")[3].innerHTML=asiString;
        }
        
        if(level>=5){
            var lvl5String="<br>";
            lvl5String+="<button class=\"collapsible\">Extra Attack:</button><div class=\"content\">";
            lvl5String+="<br>"+classJSON['Barbarian']['Class Features']['Extra Attack']+"</div><br><br>";
            lvl5String+="<button class=\"collapsible\">Fast Movement:</button><div class=\"content\">";
            lvl5String+="<br>"+classJSON['Barbarian']['Class Features']['Fast Movement']+"</div><br><br>";
            
            document.getElementsByClassName("lvlContent")[4].innerHTML=lvl5String;
        }
        
        if(level>=6){
            var lvl6String="<br>";
            lvl6String+="<button class=\"collapsible\">Path of the Berserker:</button><div class=\"content\">";
            lvl6String+="<br><button class=\"collapsible\">Mindless Rage:</button><div class=\"content\">";
            lvl6String+="<br>"+classJSON['Barbarian']['Class Features']['Path of the Berserker']['Mindless Rage']+"</div><br><br></div><br>";
            document.getElementsByClassName("lvlContent")[5].innerHTML=lvl6String;

        }
        
        if(level>=7){
            var lvl7String="<br>";
            lvl7String+="<br><button class=\"collapsible\">Feral Instinct:</button><div class=\"content\">";
            lvl7String+="<br>"+classJSON['Barbarian']['Class Features']['Feral Instinct']['content'].join(" ")+"</div><br><br>";
            document.getElementsByClassName("lvlContent")[6].innerHTML=lvl7String;

        }
        

        if(level>=8){
            document.getElementsByClassName("lvlContent")[7].innerHTML=asiString;
        }
        
        /*Since barbarians have this same feature at level 13 and 17, it saves us from filling in those elements*/
        if(level>=9){
            
            var lvl9String="<br>";
            lvl9String+="<br><button class=\"collapsible\">Brutal Critical:</button><div class=\"content\">";
            lvl9String+="<br>"+classJSON['Barbarian']['Class Features']['Brutal Critical']['content'].join(" ")+"</div><br><br>";
            document.getElementsByClassName("lvlContent")[8].innerHTML=lvl9String;
        }
        
        
        if(level>=10){
            
            var lvl10String="<br>";
            lvl10String+="<button class=\"collapsible\">Path of the Berserker:</button><div class=\"content\">";
            lvl10String+="<br><button class=\"collapsible\">Intimidating Presence:</button><div class=\"content\">";
            lvl10String+="<br>"+classJSON['Barbarian']['Class Features']['Path of the Berserker']['Intimidating Presence']['content'].join(" ")+"</div><br><br></div><br>";
            document.getElementsByClassName("lvlContent")[9].innerHTML=lvl10String;
        }
        
        if(level>=11){
            
            var lvl11String="<br>";
            lvl11String+="<br><button class=\"collapsible\">Relentless Rage:</button><div class=\"content\">";
            lvl11String+="<br>"+classJSON['Barbarian']['Class Features']['Relentless Rage']['content'].join(" ")+"</div><br><br>";
            document.getElementsByClassName("lvlContent")[10].innerHTML=lvl11String;
        }
        
        if(level>=12){
            document.getElementsByClassName("lvlContent")[11].innerHTML=asiString;
        
        }
        
        /*level 12 is an ASI, and level 13 is brutal critical again*/
        if(level>=14){
            
            var lvl14String="<br>";
            lvl14String+="<button class=\"collapsible\">Path of the Berserker:</button><div class=\"content\">";
            lvl14String+="<br><button class=\"collapsible\">Retaliation:</button><div class=\"content\">";
            lvl14String+="<br>"+classJSON['Barbarian']['Class Features']['Path of the Berserker']['Retaliation']+"</div><br><br></div><br>";
            document.getElementsByClassName("lvlContent")[13].innerHTML=lvl14String;
        }
        
        if(level>=15){
            
            var lvl15String="<br>";
            lvl15String+="<br><button class=\"collapsible\">Persistent Rage:</button><div class=\"content\">";
            lvl15String+="<br>"+classJSON['Barbarian']['Class Features']['Persistent Rage']+"</div><br><br>";
            document.getElementsByClassName("lvlContent")[14].innerHTML=lvl15String;
        }
        
        if(level>=16){
            document.getElementsByClassName("lvlContent")[15].innerHTML=asiString;
        }
        
        /*17 is brutal crit again*/
        
        if(level>=18){
            lvl18Features+="<b>Indomitable Might:</b><br>";
            lvl18Features+=classJSON['Barbarian']['Class Features']['Indomitable Might']; 
            lvl18Element.innerHTML=lvl18Features;
            
            var lvl18String="<br>";
            lvl18String+="<br><button class=\"collapsible\">Indomitable Might:</button><div class=\"content\">";
            lvl18String+="<br>"+classJSON['Barbarian']['Class Features']['Indomitable Might']+"</div><br><br>";
            document.getElementsByClassName("lvlContent")[17].innerHTML=lvl18String;
        }
        
        if(level>=19){
            document.getElementsByClassName("lvlContent")[18].innerHTML=asiString;
        }
        
        if(level==20){
            lvl20Features+="<b>Primal Champion:</b><br>";
            lvl20Features+=classJSON['Barbarian']['Class Features']['Primal Champion']; 
            lvl20Element.innerHTML=lvl20Features;
            
            var lvl20String="<br>";
            lvl20String+="<br><button class=\"collapsible\">Primal Champion:</button><div class=\"content\">";
            lvl20String+="<br>"+classJSON['Barbarian']['Class Features']['Primal Champion']+"</div><br><br>";
            document.getElementsByClassName("lvlContent")[19].innerHTML=lvl20String;
        }
        
        
    }
    else if(charClass=="bard"){
        
        /*basic features for classes include hit points, proficiencies, and equipment*/
        basicFeaturesString+="<br><br>Hit Points: <br>" + classJSON['Bard']['Class Features']['Hit Points']['content'][0] + "<br>";
        basicFeaturesString+=classJSON['Bard']['Class Features']['Hit Points']['content'][1] + "<br>";
        basicFeaturesString+=classJSON['Bard']['Class Features']['Hit Points']['content'][2] + "<br><br>";
        basicFeaturesString+="Proficiences:<br>";
        basicFeaturesString+=classJSON['Bard']['Class Features']['Proficiencies']['content'][0]+"<br>";
        basicFeaturesString+=classJSON['Bard']['Class Features']['Proficiencies']['content'][1]+"<br>";
        basicFeaturesString+=classJSON['Bard']['Class Features']['Proficiencies']['content'][2]+"<br>";
        basicFeaturesString+=classJSON['Bard']['Class Features']['Proficiencies']['content'][3]+"<br>";
        basicFeaturesString+=classJSON['Bard']['Class Features']['Proficiencies']['content'][4]+"<br><br>";
        basicFeaturesString+="Equipment:<br>";
        basicFeaturesString+=classJSON['Bard']['Class Features']['Equipment']['content'][0]+"<br>";
        basicFeaturesString+="- " + classJSON['Bard']['Class Features']['Equipment']['content'][1][0]+"<br>";
        basicFeaturesString+="- " + classJSON['Bard']['Class Features']['Equipment']['content'][1][1]+"<br>";
        basicFeaturesString+="- " + classJSON['Bard']['Class Features']['Equipment']['content'][1][2]+"<br>";

        basicFeatures.innerHTML=basicFeaturesString;

        
        
        var lvl1String="<br><br>";
        
        
        lvl1String+="<button class=\"collapsible\">Spellcasting</button><div class=\"content\">";
        lvl1String+="<br>"+classJSON['Bard']['Class Features']['Spellcasting']['content'].join(" ")+"<br><br>";
        lvl1String+="<button class=\"collapsible\">Cantrips</button><div class=\"content\">";
        lvl1String+="<br>"+classJSON['Bard']['Class Features']['Spellcasting']['Cantrips']+"</div><br><br>";
        lvl1String+="<button class=\"collapsible\">Spell Slots</button><div class=\"content\">";
        lvl1String+="<br>"+classJSON['Bard']['Class Features']['Spellcasting']['Spell Slots']['content'].join(" ")+"</div><br><br>";
        lvl1String+="<button class=\"collapsible\">Spells Known of 1st Level and Higher</button><div class=\"content\">";
        lvl1String+="<br>"+classJSON['Bard']['Class Features']['Spellcasting']['Spells Known of 1st Level and Higher']['content'].join(" ")+"</div><br><br>";
        lvl1String+="<button class=\"collapsible\">Spellcasting Ability</button><div class=\"content\">";
        lvl1String+="<br>"+classJSON['Bard']['Class Features']['Spellcasting']['Spellcasting Ability']['content'].join("<br><br>")+"</div><br><br>";
        lvl1String+="<button class=\"collapsible\">Ritual Casting</button><div class=\"content\">";
        lvl1String+="<br>"+classJSON['Bard']['Class Features']['Spellcasting']['Ritual Casting']+"</div><br><br>";
        lvl1String+="<button class=\"collapsible\">Spellcasting Focus</button><div class=\"content\">";
        lvl1String+="<br>"+classJSON['Bard']['Class Features']['Spellcasting']['Spellcasting Focus']+"</div><br><br></div><br><br>";
        
        lvl1String+="<button class=\"collapsible\">Bardic Inspiration</button><div class=\"content\">";
        lvl1String+="<br>"+classJSON['Bard']['Class Features']['Bardic Inspiration']['content'].join(" ")+"</div><br><br>";
        

        document.getElementsByClassName("lvlContent")[0].innerHTML=lvl1String;
        
        if(level>=2){
            var lvl2String="<br>";
            
            lvl2String+="<button class=\"collapsible\">Jack of All Trades:</button><div class=\"content\">";
            lvl2String+="<br>"+classJSON['Bard']['Class Features']['Jack of All Trades']+"</div><br><br>";
            lvl2String+="<button class=\"collapsible\">Song of Rest:</button><div class=\"content\">";
            lvl2String+="<br>"+classJSON['Bard']['Class Features']['Song of Rest']['content'].join(" ")+"</div><br><br>";
            
            document.getElementsByClassName("lvlContent")[1].innerHTML=lvl2String;
        }
        
        if(level>=3){
            
            var lvl3String="<br><br>";
            lvl3String+="<button class=\"collapsible\">Expertise:</button><div class=\"content\">";
            lvl3String+="<br>"+classJSON['Bard']['Class Features']['Expertise']['content'].join(" ")+"</div><br><br>";
            lvl3String+="<button class=\"collapsible\">Bard College:</button><div class=\"content\">";
            lvl3String+="<br>"+classJSON['Bard']['Class Features']['Bard College']['content'].join(" ")+"</div><br><br>";
            lvl3String+="<button class=\"collapsible\">College of Lore:</button><div class=\"content\">";
            lvl3String+="<br>"+classJSON['Bard']['Class Features']['College of Lore']['content'].join(" ")+"<br><br>";
            lvl3String+="<button class=\"collapsible\">Bonus Proficiencies:</button><div class=\"content\">";
            lvl3String+="<br>"+classJSON['Bard']['Class Features']['College of Lore']['Bonus Proficiencies']+"</div><br><br>";
            lvl3String+="<button class=\"collapsible\">Cutting Words:</button><div class=\"content\">";
            lvl3String+="<br>"+classJSON['Bard']['Class Features']['College of Lore']['Cutting Words']+"</div><br><br></div><br>";
            
            document.getElementsByClassName("lvlContent")[2].innerHTML=lvl3String;
        }
        
        //use this string for levels 4, 8, 12, 16, and 19
        var asiString="<br><br>";
        asiString+="<button class=\"collapsible\">Ability Score Improvement:</button><div class=\"content\">";
        asiString+="<br>"+classJSON['Bard']['Class Features']['Ability Score Improvement']+"</div><br><br>";
        
        if(level>=4){
            document.getElementsByClassName("lvlContent")[3].innerHTML=asiString;
        }

        if(level>=5){
            var lvl5String="<br><br>";
            lvl5String+="<button class=\"collapsible\">Font of Inspiration:</button><div class=\"content\">";
            lvl5String+="<br>"+classJSON['Bard']['Class Features']['Font of Inspiration']+"</div><br><br>";
            
            document.getElementsByClassName("lvlContent")[4].innerHTML=lvl5String;
        }
        
        if(level>=6){
            
            var lvl6String="<br><br>";
            lvl6String+="<button class=\"collapsible\">Countercharm:</button><div class=\"content\">";
            lvl6String+="<br>"+classJSON['Bard']['Class Features']['Countercharm']+"</div><br><br>";
            lvl6String+="<button class=\"collapsible\">College of Lore:</button><div class=\"content\"><br>";
            lvl6String+="<button class=\"collapsible\">Additional Magic Secrets:</button><div class=\"content\">";
            lvl6String+="<br>"+classJSON['Bard']['Class Features']['Font of Inspiration']+"</div><br><br></div><br>";
            
            document.getElementsByClassName("lvlContent")[5].innerHTML=lvl6String;
            
        }
        
        if(level>=8){
            document.getElementsByClassName("lvlContent")[7].innerHTML=asiString;
        }
        
        if(level>=10){
            var lvl10String="<br><br>";
            lvl10String+="<button class=\"collapsible\">Magical Secrets:</button><div class=\"content\">";
            lvl10String+="<br>"+classJSON['Bard']['Class Features']['Magical Secrets']['content'].join(" ")+"</div><br><br>";
            document.getElementsByClassName("lvlContent")[9].innerHTML=lvl10String;

        }
        
        if(level>=12){
            document.getElementsByClassName("lvlContent")[11].innerHTML=asiString;
        }
        
        if(level>=14){
            var lvl14String="<br><br>";
            lvl14String+="<button class=\"collapsible\">College of Lore:</button><div class=\"content\"><br>";
            lvl14String+="<button class=\"collapsible\">Peerless Skill:</button><div class=\"content\">";
            lvl14String+="<br>"+classJSON['Bard']['Class Features']['College of Lore']['Peerless Skill']+"</div><br><br></div><br>";
            document.getElementsByClassName("lvlContent")[13].innerHTML=lvl14String;

        }
        
        if(level>=16){
            document.getElementsByClassName("lvlContent")[15].innerHTML=asiString;
        }
        
        if(level>=19){
            document.getElementsByClassName("lvlContent")[18].innerHTML=asiString;
        }
        
        if(level==20){
            var lvl20String="<br><br>";
            lvl20String+="<button class=\"collapsible\">Superior Inspiration:</button><div class=\"content\">";
            lvl20String+="<br>"+classJSON['Bard']['Class Features']['Superior Inspiration']+"</div><br><br>";
            document.getElementsByClassName("lvlContent")[19].innerHTML=lvl20String;
        }
        
        var bardCantrips = spellJSON['Spellcasting']['Spell Lists']['Bard Spells']['Cantrips (0 Level)'];
        var bardLvl1Spells = spellJSON['Spellcasting']['Spell Lists']['Bard Spells']['1st Level'];
        var allSpells = spellJSON['Spellcasting']['Spell Descriptions'];
        
        /*calling the below function showed us that all of the spells are considered different attributes of the spell descriptions object. For example, how acid arrow works is held in the "acid arrow" attribute*/
        //console.log(Object.keys(allSpells));
        
        //below is an example of how we can use var to access json array values
        //var tempVar="Acid Splash";
        //console.log(allSpells[tempVar]);
        
        //var spellsElement = document.getElementById("final spells");
        var spellString="";
        var cantripString="<br><br>";
        
        //TODO - see if Vicious Mockery is in SRD, and add it to JSON if so
        for(var i=0;i<bardCantrips.length;i++){
            cantripString+="<button class=\"collapsible\">"+bardCantrips[i]+"</button><div class=\"content\">";
            cantripString+=allSpells[bardCantrips[i]]['content'].join("<br>")+"</div><br><br>";
            
        }
        
        
        document.getElementsByClassName("mainContent")[0].innerHTML=cantripString;
        
        var spell1String="<br><br>";
        
        for(var i=0;i<bardLvl1Spells.length;i++){
            
            //this works for nested buttons
            spell1String+="<button class=\"collapsible\">"+bardLvl1Spells[i]+"</button><div class=\"content\">";
            spell1String+=allSpells[bardLvl1Spells[i]]['content'].join("<br>")+"</div><br><br>";
            
        }

        document.getElementsByClassName("mainContent")[1].innerHTML=spell1String;

        
        if(level>=3){
            var bardLvl2Spells = spellJSON['Spellcasting']['Spell Lists']['Bard Spells']['2nd Level'];
            var spell2String="<br><br>";
            for(var i=0;i<bardLvl2Spells.length;i++){
                
                spell2String+="<button class=\"collapsible\">"+bardLvl2Spells[i]+"</button><div class=\"content\">";
                spell2String+=allSpells[bardLvl2Spells[i]]['content'].join("<br>")+"</div><br><br>";
            }
            document.getElementsByClassName("mainContent")[2].innerHTML=spell2String;
        }
        
        
        if(level>=5){
            var bardLvl3Spells = spellJSON['Spellcasting']['Spell Lists']['Bard Spells']['3rd Level'];
            var spell3String="<br><br>";
            for(var i=0;i<bardLvl3Spells.length;i++){
                spell3String+="<button class=\"collapsible\">"+bardLvl3Spells[i]+"</button><div class=\"content\">";
                spell3String+=allSpells[bardLvl3Spells[i]]['content'].join("<br>")+"</div><br><br>";
            }
            document.getElementsByClassName("mainContent")[3].innerHTML=spell3String;
        }
        
        if(level>=7){
            var bardLvl4Spells = spellJSON['Spellcasting']['Spell Lists']['Bard Spells']['4th Level'];
            var spell4String="<br><br>";
            for(var i=0;i<bardLvl4Spells.length;i++){
                spell4String+="<button class=\"collapsible\">"+bardLvl4Spells[i]+"</button><div class=\"content\">";
                spell4String+=allSpells[bardLvl4Spells[i]]['content'].join("<br>")+"</div><br><br>";
            }
            document.getElementsByClassName("mainContent")[4].innerHTML=spell4String;
        }
        
        if(level>=9){
            var bardLvl5Spells = spellJSON['Spellcasting']['Spell Lists']['Bard Spells']['5th Level'];
            var spell5String="<br><br>";
            for(var i=0;i<bardLvl5Spells.length;i++){
                spell5String+="<button class=\"collapsible\">"+bardLvl5Spells[i]+"</button><div class=\"content\">";
                spell5String+=allSpells[bardLvl5Spells[i]]['content'].join("<br>")+"</div><br><br>";
            }
            document.getElementsByClassName("mainContent")[5].innerHTML=spell5String;
        }
        
        if(level>=11){
            var bardLvl6Spells = spellJSON['Spellcasting']['Spell Lists']['Bard Spells']['6th Level'];
            var spell6String="<br><br>";
            for(var i=0;i<bardLvl6Spells.length;i++){
                spell6String+="<button class=\"collapsible\">"+bardLvl6Spells[i]+"</button><div class=\"content\">";
                spell6String+=allSpells[bardLvl6Spells[i]]['content'].join("<br>")+"</div><br><br>";
            }
            document.getElementsByClassName("mainContent")[6].innerHTML=spell6String;
        }
        
        if(level>=13){
            var bardLvl7Spells = spellJSON['Spellcasting']['Spell Lists']['Bard Spells']['7th Level'];
            var spell7String="<br><br>";
            for(var i=0;i<bardLvl7Spells.length;i++){
                spell7String+="<button class=\"collapsible\">"+bardLvl7Spells[i]+"</button><div class=\"content\">";
                spell7String+=allSpells[bardLvl7Spells[i]]['content'].join("<br>")+"</div><br><br>";
            }
            document.getElementsByClassName("mainContent")[7].innerHTML=spell7String;
        }
        
        if(level>=15){
            var bardLvl8Spells = spellJSON['Spellcasting']['Spell Lists']['Bard Spells']['8th Level'];
            var spell8String="<br><br>";
            for(var i=0;i<bardLvl8Spells.length;i++){
                spell8String+="<button class=\"collapsible\">"+bardLvl8Spells[i]+"</button><div class=\"content\">";
                spell8String+=allSpells[bardLvl8Spells[i]]['content'].join("<br>")+"</div><br><br>";
            }
            document.getElementsByClassName("mainContent")[8].innerHTML=spell8String;
        }
        
        if(level>=17){
            var bardLvl9Spells = spellJSON['Spellcasting']['Spell Lists']['Bard Spells']['9th Level'];
            var spell9String="<br><br>";
            for(var i=0;i<bardLvl9Spells.length;i++){
                spell9String+="<button class=\"collapsible\">"+bardLvl9Spells[i]+"</button><div class=\"content\">";
                spell9String+=allSpells[bardLvl9Spells[i]]['content'].join("<br>")+"</div><br><br>";
            }
            document.getElementsByClassName("mainContent")[9].innerHTML=spell9String;
        }
        
        
        
        //spellsElement.innerHTML=spellString;
        
        
        
    }
    else if(charClass=="cleric"){
        
        
        /*basic features for classes include hit points, proficiencies, and equipment*/
        basicFeaturesString+="<br><br>Hit Points: <br>" + classJSON['Cleric']['Class Features']['Hit Points']['content'][0] + "<br>";
        basicFeaturesString+=classJSON['Cleric']['Class Features']['Hit Points']['content'][1] + "<br>";
        basicFeaturesString+=classJSON['Cleric']['Class Features']['Hit Points']['content'][2] + "<br><br>";
        basicFeaturesString+="Proficiences:<br>";
        basicFeaturesString+=classJSON['Cleric']['Class Features']['Proficiencies']['content'][0]+"<br>";
        basicFeaturesString+=classJSON['Cleric']['Class Features']['Proficiencies']['content'][1]+"<br>";
        basicFeaturesString+=classJSON['Cleric']['Class Features']['Proficiencies']['content'][2]+"<br>";
        basicFeaturesString+=classJSON['Cleric']['Class Features']['Proficiencies']['content'][3]+"<br>";
        basicFeaturesString+=classJSON['Cleric']['Class Features']['Proficiencies']['content'][4]+"<br><br>";
        basicFeaturesString+="Equipment:<br>";
        basicFeaturesString+=classJSON['Cleric']['Class Features']['Equipment']['content'][0]+"<br>";
        basicFeaturesString+="- " + classJSON['Cleric']['Class Features']['Equipment']['content'][1][0]+"<br>";
        basicFeaturesString+="- " + classJSON['Cleric']['Class Features']['Equipment']['content'][1][1]+"<br>";
        basicFeaturesString+="- " + classJSON['Cleric']['Class Features']['Equipment']['content'][1][2]+"<br>";

        basicFeatures.innerHTML=basicFeaturesString;
        

        var lvl1String="<br><br>";
        
        
        lvl1String+="<button class=\"collapsible\">Spellcasting:</button><div class=\"content\">";
        lvl1String+="<br>"+classJSON['Cleric']['Class Features']['Spellcasting']['content']+"<br><br>";
        lvl1String+="<button class=\"collapsible\">Cantrips:</button><div class=\"content\">";
        lvl1String+="<br>"+classJSON['Cleric']['Class Features']['Spellcasting']['Cantrips']+"</div><br><br>";
        lvl1String+="<button class=\"collapsible\">Preparing and Casting Spells:</button><div class=\"content\">";
        lvl1String+="<br>"+classJSON['Cleric']['Class Features']['Spellcasting']['Preparing and Casting Spells']['content'].join(" ")+"</div><br><br>";
        lvl1String+="<button class=\"collapsible\">Spellcasting Ability</button><div class=\"content\">";
        lvl1String+="<br>"+classJSON['Cleric']['Class Features']['Spellcasting']['Spellcasting Ability']['content'].join("<br><br>")+"</div><br><br>";
        lvl1String+="<button class=\"collapsible\">Ritual Casting</button><div class=\"content\">";
        lvl1String+="<br>"+classJSON['Cleric']['Class Features']['Spellcasting']['Ritual Casting']+"</div><br><br>";
        lvl1String+="<button class=\"collapsible\">Spellcasting Focus</button><div class=\"content\">";
        lvl1String+="<br>"+classJSON['Cleric']['Class Features']['Spellcasting']['Spellcasting Focus']+"</div><br><br></div><br><br>";
        
        lvl1String+="<button class=\"collapsible\">Divine Domain</button><div class=\"content\">";
        lvl1String+="<br>"+classJSON['Cleric']['Class Features']['Divine Domain']['content']+"</div><br><br>";
        lvl1String+="<button class=\"collapsible\">Domain Spells</button><div class=\"content\">";
        lvl1String+="<br>"+classJSON['Cleric']['Class Features']['Divine Domain']['Domain Spells']['content'].join(" ")+"</div><br><br>";
        lvl1String+="<button class=\"collapsible\">Life Domain</button><div class=\"content\">";
        lvl1String+="<br>"+classJSON['Cleric']['Class Features']['Life Domain']['content']+"<br><br>";
        
        lvl1String+="<button class=\"collapsible\">Life Domain Spells</button><div class=\"content\">";
        lvl1String+="<br><table>"+
        "<tr>"+
        "<th>Cleric Level</th><th>Spells</th>"+    
        "</tr>"+
        "<tr>"+
        "<td>"+ classJSON['Cleric']['Class Features']['Life Domain']['Life Domain Spells']['table']['Cleric Level'][0] +"</td>"+
        "<td>"+ classJSON['Cleric']['Class Features']['Life Domain']['Life Domain Spells']['table']['Spells'][0] +"</td>"+
        "</tr>"+
        "<tr>"+
        "<td>"+ classJSON['Cleric']['Class Features']['Life Domain']['Life Domain Spells']['table']['Cleric Level'][1] +"</td>"+
        "<td>"+ classJSON['Cleric']['Class Features']['Life Domain']['Life Domain Spells']['table']['Spells'][1] +"</td>"+
        "</tr>"+
        "<tr>"+
        "<td>"+ classJSON['Cleric']['Class Features']['Life Domain']['Life Domain Spells']['table']['Cleric Level'][2] +"</td>"+
        "<td>"+ classJSON['Cleric']['Class Features']['Life Domain']['Life Domain Spells']['table']['Spells'][2] +"</td>"+
        "</tr>"+
        "<tr>"+
        "<td>"+ classJSON['Cleric']['Class Features']['Life Domain']['Life Domain Spells']['table']['Cleric Level'][3] +"</td>"+
        "<td>"+ classJSON['Cleric']['Class Features']['Life Domain']['Life Domain Spells']['table']['Spells'][3] +"</td>"+
        "</tr>"+
        "<tr>"+
        "<td>"+ classJSON['Cleric']['Class Features']['Life Domain']['Life Domain Spells']['table']['Cleric Level'][4] +"</td>"+
        "<td>"+ classJSON['Cleric']['Class Features']['Life Domain']['Life Domain Spells']['table']['Spells'][4] +"</td>"+
        "</tr>"+
        "</table><br><br>";
        lvl1String+="</div><br>";
        
        lvl1String+="<button class=\"collapsible\">Bonus Proficiency:</button><div class=\"content\">";
        lvl1String+="<br>"+classJSON['Cleric']['Class Features']['Life Domain']['Bonus Proficiency']+"</div><br>";
        lvl1String+="<button class=\"collapsible\">Disciple of Life:</button><div class=\"content\">";
        lvl1String+="<br>"+classJSON['Cleric']['Class Features']['Life Domain']['Disciple of Life']+"</div><br><br></div><br>";
        
        
        
        document.getElementsByClassName("lvlContent")[0].innerHTML=lvl1String;
        
        
        if(level>=2){
            
            lvl2String="<br>";
            lvl2String+="<button class=\"collapsible\">Channel Divinity:</button><div class=\"content\">";
            lvl2String+="<br>"+classJSON['Cleric']['Class Features']['Channel Divinity']['content'].join(" ")+"<br>";
            lvl2String+="<br><button class=\"collapsible\">Channel Divinity - Turn Undead</button><div class=\"content\">";
            lvl2String+="<br>"+classJSON['Cleric']['Class Features']['Channel Divinity']['Channel Divinity: Turn Undead']['content'].join(" ")+"<br></div><br>";
            lvl2String+="<button class=\"collapsible\">Life Domain</button><div class=\"content\">";
            lvl2String+="<br><button class=\"collapsible\">Channel Divinity - Preserve Life</button><div class=\"content\">";
            lvl2String+="<br>"+classJSON['Cleric']['Class Features']['Life Domain']['Channel Divinity: Preserve Life']['content'].join(" ")+"</div><br></div><br></div><br>";
            document.getElementsByClassName("lvlContent")[1].innerHTML=lvl2String;
            
        }
        
        
        //use this string for levels 4, 8, 12, 16, and 19
        var asiString="<br><br>";
        asiString+="<button class=\"collapsible\">Ability Score Improvement:</button><div class=\"content\">";
        asiString+="<br>"+classJSON['Cleric']['Class Features']['Ability Score Improvement']+"</div><br><br>";
        
        if(level>=4){
            document.getElementsByClassName("lvlContent")[3].innerHTML=asiString;
        }
        
        if(level>=5){
            
            var lvl5String="<br>";
            lvl5String+="<button class=\"collapsible\">Destroy Undead:</button><div class=\"content\">";
            lvl5String+="<br>"+classJSON['Cleric']['Class Features']['Destroy Undead']['content'];
            lvl5String+="<table>"+
            "<tr>"+
            "<th>Cleric Level</th><th>Destroys Undead of CR...</th>"+    
            "</tr>"+
            "<tr>"+
            "<td>"+ classJSON['Cleric']['Class Features']['Destroy Undead']['Destroy Undead']['table']['Cleric Level'][0] +"</td>"+
            "<td>"+ classJSON['Cleric']['Class Features']['Destroy Undead']['Destroy Undead']['table']['Destroys Undead of CR...'][0] +"</td>"+
            "</tr>"+
            "<tr>"+
            "<td>"+ classJSON['Cleric']['Class Features']['Destroy Undead']['Destroy Undead']['table']['Cleric Level'][1] +"</td>"+
            "<td>"+ classJSON['Cleric']['Class Features']['Destroy Undead']['Destroy Undead']['table']['Destroys Undead of CR...'][1] +"</td>"+
            "</tr>"+
            "<tr>"+
            "<td>"+ classJSON['Cleric']['Class Features']['Destroy Undead']['Destroy Undead']['table']['Cleric Level'][2] +"</td>"+
            "<td>"+ classJSON['Cleric']['Class Features']['Destroy Undead']['Destroy Undead']['table']['Destroys Undead of CR...'][2] +"</td>"+"</tr>"+
            "<tr>"+
            "<td>"+ classJSON['Cleric']['Class Features']['Destroy Undead']['Destroy Undead']['table']['Cleric Level'][3] +"</td>"+
            "<td>"+ classJSON['Cleric']['Class Features']['Destroy Undead']['Destroy Undead']['table']['Destroys Undead of CR...'][3] +"</td>"+"</tr>"+
            "<tr>"+
            "<td>"+ classJSON['Cleric']['Class Features']['Destroy Undead']['Destroy Undead']['table']['Cleric Level'][4] +"</td>"+
            "<td>"+ classJSON['Cleric']['Class Features']['Destroy Undead']['Destroy Undead']['table']['Destroys Undead of CR...'][4] +"</td>"+"</tr>"+
            "</table></div><br>";
            
            document.getElementsByClassName("lvlContent")[4].innerHTML=lvl5String;
        }
        
        
        if(level>=6){
            lvl6Features+="<b>Blessed Healer:</b><br>";
            lvl6Features+=classJSON['Cleric']['Class Features']['Life Domain']['Blessed Healer'];
            
            lvl6Element.innerHTML=lvl6Features;
            
            var lvl6String="<br>";
            lvl6String+="<button class=\"collapsible\">Life Domain</button><div class=\"content\">";
            lvl6String+="<br><button class=\"collapsible\">Blessed Healer</button><div class=\"content\">";
            lvl6String+="<br>"+classJSON['Cleric']['Class Features']['Life Domain']['Blessed Healer']+"<br></div><br></div><br>";
            document.getElementsByClassName("lvlContent")[5].innerHTML=lvl6String;
        }
        
        /*lvl 7 is spells*/
        if(level>=8){
            
            
            var lvl8String="<br>";
            lvl8String+="<button class=\"collapsible\">Divine Strike</button><div class=\"content\">";
            lvl8String+="<br>"+classJSON['Cleric']['Class Features']['Life Domain']['Divine Strike']+"<br></div>";
            lvl8String+=asiString;
            document.getElementsByClassName("lvlContent")[7].innerHTML=lvl8String;
        
        }
        
        if(level>=10){
            
            var lvl10String="<br>";
            lvl10String+="<button class=\"collapsible\">Divine Intervention</button><div class=\"content\">";
            lvl10String+="<br>"+classJSON['Cleric']['Class Features']['Divine Intervention']['content'].join(" ")+"<br></div><br>";
            document.getElementsByClassName("lvlContent")[9].innerHTML=lvl10String;
        }
        
        if(level>=12){
            
            document.getElementsByClassName("lvlContent")[11].innerHTML=asiString;
        
        }
        
        /*all other levels aside from 17 are already defined or more spells*/
        if(level>=17){
            
            var lvl17String="<br>";
            lvl17String+="<button class=\"collapsible\">Life Domain</button><div class=\"content\">";
            lvl17String+="<br><button class=\"collapsible\">Supreme Healing</button><div class=\"content\">";
            lvl17String+="<br>"+classJSON['Cleric']['Class Features']['Life Domain']['Supreme Healing']+"<br></div><br></div><br>";
            document.getElementsByClassName("lvlContent")[16].innerHTML=lvl17String;
        }
        
        if(level>=19){
            document.getElementsByClassName("lvlContent")[18].innerHTML=asiString;
        }
        
        
        var clericCantrips = spellJSON['Spellcasting']['Spell Lists']['Cleric Spells']['Cantrips (0 Level)'];
        var clericLvl1Spells = spellJSON['Spellcasting']['Spell Lists']['Cleric Spells']['1st Level'];
        var allSpells = spellJSON['Spellcasting']['Spell Descriptions'];
        
        //var spellsElement = document.getElementById("final spells");
        var spell1String="<br><br>";
        var cantripString="<br><br>";
        for(var i=0;i<clericCantrips.length;i++){
            cantripString+="<button class=\"collapsible\">"+clericCantrips[i]+"</button><div class=\"content\">";
            cantripString+=allSpells[clericCantrips[i]]['content'].join("<br>")+"</div><br><br>";
        }
        for(var i=0;i<clericLvl1Spells.length;i++){
            spell1String+="<button class=\"collapsible\">"+clericLvl1Spells[i]+"</button><div class=\"content\">";
            spell1String+=allSpells[clericLvl1Spells[i]]['content'].join("<br>")+"</div><br><br>";
        }
        
        document.getElementsByClassName("mainContent")[0].innerHTML=cantripString;
        document.getElementsByClassName("mainContent")[1].innerHTML=spell1String;
        
        if(level>=3){
            var clericLvl2Spells = spellJSON['Spellcasting']['Spell Lists']['Cleric Spells']['2nd Level'];
            var spell2String="<br><br>";
            for(var i=0;i<clericLvl2Spells.length;i++){
                spell2String+="<button class=\"collapsible\">"+clericLvl2Spells[i]+"</button><div class=\"content\">";
                spell2String+=allSpells[clericLvl2Spells[i]]['content'].join("<br>")+"</div><br><br>";
            }
            document.getElementsByClassName("mainContent")[2].innerHTML=spell2String;
        }
        
        
        
        if(level>=5){
            var clericLvl3Spells = spellJSON['Spellcasting']['Spell Lists']['Cleric Spells']['3rd Level'];
            var spell3String="<br><br>";
            for(var i=0;i<clericLvl3Spells.length;i++){
                spell3String+="<button class=\"collapsible\">"+clericLvl3Spells[i]+"</button><div class=\"content\">";
                spell3String+=allSpells[clericLvl3Spells[i]]['content'].join("<br>")+"</div><br><br>";
            }
            document.getElementsByClassName("mainContent")[3].innerHTML=spell3String;
        }
        
        if(level>=7){
            var spell3String="<br><br>";
            var clericLvl4Spells = spellJSON['Spellcasting']['Spell Lists']['Cleric Spells']['4th Level'];
            for(var i=0;i<clericLvl4Spells.length;i++){
                spell3String+="<button class=\"collapsible\">"+clericLvl3Spells[i]+"</button><div class=\"content\">";
                spell3String+=allSpells[clericLvl3Spells[i]]['content'].join("<br>")+"</div><br><br>";
            }
            document.getElementsByClassName("mainContent")[4].innerHTML=spell4String;
        }
        
        if(level>=9){
            var spell5String="<br><br>";
            var clericLvl5Spells = spellJSON['Spellcasting']['Spell Lists']['Cleric Spells']['5th Level'];
            for(var i=0;i<clericLvl5Spells.length;i++){
                spell5String+="<button class=\"collapsible\">"+clericLvl5Spells[i]+"</button><div class=\"content\">";
                spell5String+=allSpells[clericLvl5Spells[i]]['content'].join("<br>")+"</div><br><br>";
            }
            document.getElementsByClassName("mainContent")[5].innerHTML=spell5String;
        }
        
        if(level>=11){
            var spell6String="<br><br>";
            var clericLvl6Spells = spellJSON['Spellcasting']['Spell Lists']['Cleric Spells']['6th Level'];
            for(var i=0;i<clericLvl6Spells.length;i++){
                spell6String+="<button class=\"collapsible\">"+clericLvl6Spells[i]+"</button><div class=\"content\">";
                spell6String+=allSpells[clericLvl6Spells[i]]['content'].join("<br>")+"</div><br><br>";
            }
            document.getElementsByClassName("mainContent")[6].innerHTML=spell6String;
        }
        
        if(level>=13){
            var spell7String="<br><br>";
            var clericLvl7Spells = spellJSON['Spellcasting']['Spell Lists']['Cleric Spells']['7th Level'];
            for(var i=0;i<clericLvl7Spells.length;i++){
                spell7String+="<button class=\"collapsible\">"+clericLvl7Spells[i]+"</button><div class=\"content\">";
                spell7String+=allSpells[clericLvl7Spells[i]]['content'].join("<br>")+"</div><br><br>";
            }
            document.getElementsByClassName("mainContent")[7].innerHTML=spell7String;
        }
        
        if(level>=15){
            var spell8String="<br><br>";
            var clericLvl8Spells = spellJSON['Spellcasting']['Spell Lists']['Cleric Spells']['8th Level'];
            for(var i=0;i<clericLvl8Spells.length;i++){
                spell8String+="<button class=\"collapsible\">"+clericLvl8Spells[i]+"</button><div class=\"content\">";
                spell8String+=allSpells[clericLvl8Spells[i]]['content'].join("<br>")+"</div><br><br>";
            }
            document.getElementsByClassName("mainContent")[8].innerHTML=spell8String;
        }
        
        if(level>=17){
            var spell9String="<br><br>";
            var clericLvl9Spells = spellJSON['Spellcasting']['Spell Lists']['Cleric Spells']['9th Level'];
            for(var i=0;i<clericLvl9Spells.length;i++){
                spell9String+="<button class=\"collapsible\">"+clericLvl9Spells[i]+"</button><div class=\"content\">";
                spell9String+=allSpells[clericLvl9Spells[i]]['content'].join("<br>")+"</div><br><br>";
            }
            document.getElementsByClassName("mainContent")[9].innerHTML=spell9String;
        }
        
        
        
        //spellsElement.innerHTML=spellString;
        
        
        
    }
    else if(charClass=="druid"){
        
        
        /*basic features for classes include hit points, proficiencies, and equipment*/
        basicFeaturesString+="<br><br>Hit Points: <br>" + classJSON['Druid']['Class Features']['Hit Points']['content'][0] + "<br>";
        basicFeaturesString+=classJSON['Druid']['Class Features']['Hit Points']['content'][1] + "<br>";
        basicFeaturesString+=classJSON['Druid']['Class Features']['Hit Points']['content'][2] + "<br><br>";
        basicFeaturesString+="Proficiences:<br>";
        basicFeaturesString+=classJSON['Druid']['Class Features']['Proficiencies']['content'][0]+"<br>";
        basicFeaturesString+=classJSON['Druid']['Class Features']['Proficiencies']['content'][1]+"<br>";
        basicFeaturesString+=classJSON['Druid']['Class Features']['Proficiencies']['content'][2]+"<br>";
        basicFeaturesString+=classJSON['Druid']['Class Features']['Proficiencies']['content'][3]+"<br>";
        basicFeaturesString+=classJSON['Druid']['Class Features']['Proficiencies']['content'][4]+" ";
        basicFeaturesString+=classJSON['Druid']['Class Features']['Proficiencies']['content'][5]+"<br><br>";
        basicFeaturesString+="Equipment:<br>";
        basicFeaturesString+=classJSON['Druid']['Class Features']['Equipment']['content'][0]+"<br>";
        basicFeaturesString+="- " + classJSON['Druid']['Class Features']['Equipment']['content'][1][0]+"<br>";
        basicFeaturesString+="- " + classJSON['Druid']['Class Features']['Equipment']['content'][1][1]+"<br>";
        basicFeaturesString+="- " + classJSON['Druid']['Class Features']['Equipment']['content'][1][2]+"<br>";

        basicFeatures.innerHTML=basicFeaturesString;
        
        
        
        
        
        var lvl1String="<br><br>";
        
        
        lvl1String+="<button class=\"collapsible\">Spellcasting:</button><div class=\"content\">";
        lvl1String+="<br>"+classJSON['Druid']['Class Features']['Spellcasting']['content']+"<br><br>";
        lvl1String+="<button class=\"collapsible\">Cantrips:</button><div class=\"content\">";
        lvl1String+="<br>"+classJSON['Druid']['Class Features']['Spellcasting']['Cantrips']+"</div><br><br>";
        lvl1String+="<button class=\"collapsible\">Preparing and Casting Spells:</button><div class=\"content\">";
        lvl1String+="<br>"+classJSON['Druid']['Class Features']['Spellcasting']['Preparing and Casting Spells']['content'].join(" ")+"</div><br><br>";
        lvl1String+="<button class=\"collapsible\">Spellcasting Ability</button><div class=\"content\">";
        lvl1String+="<br>"+classJSON['Druid']['Class Features']['Spellcasting']['Spellcasting Ability']['content'].join("<br><br>")+"</div><br><br>";
        lvl1String+="<button class=\"collapsible\">Ritual Casting</button><div class=\"content\">";
        lvl1String+="<br>"+classJSON['Druid']['Class Features']['Spellcasting']['Ritual Casting']+"</div><br><br>";
        lvl1String+="<button class=\"collapsible\">Spellcasting Focus</button><div class=\"content\">";
        lvl1String+="<br>"+classJSON['Druid']['Class Features']['Spellcasting']['Spellcasting Focus']+"</div><br><br></div><br><br>";
        
        lvl1String+="<button class=\"collapsible\">Druidic</button><div class=\"content\">";
        lvl1String+="<br>"+classJSON['Druid']['Class Features']['Druidic']+"</div><br><br>";
        
        lvl1String+="<button class=\"collapsible\">Sacred Plants and Wood</button><div class=\"content\">";
        lvl1String+="<br>"+classJSON['Druid']['Class Features']['Sacred Plants and Wood']['content'].join(" ")+"</div><br><br>";
        lvl1String+="<button class=\"collapsible\">Druids and the Gods</button><div class=\"content\">";
        lvl1String+="<br>"+classJSON['Druid']['Class Features']['Druids and the Gods']+"</div><br><br>";
        
        document.getElementsByClassName("lvlContent")[0].innerHTML=lvl1String;
        
        
        if(level>=2){
            
            lvl2Features+="<b>Wild Shape:</b><br>"
            lvl2Features+=classJSON['Druid']['Class Features']['Wild Shape']['content'];
            
            lvl2Features+="<table>"+
            "<tr>"+
            "<th>Level</th><th>Max CR</th><th>Limitations</th><th>Example</th>"+    
            "</tr>"+
            "<tr>"+
            "<td>"+ classJSON['Druid']['Class Features']['Wild Shape']['Beast Shapes']['table']['Level'][0]+"</td>"+
            "<td>"+ classJSON['Druid']['Class Features']['Wild Shape']['Beast Shapes']['table']['Max CR'][0] +"</td>"+
            "<td>"+ classJSON['Druid']['Class Features']['Wild Shape']['Beast Shapes']['table']['Limitations'][0]+"</td>"+
            "<td>"+ classJSON['Druid']['Class Features']['Wild Shape']['Beast Shapes']['table']['Example'][0] +"</td>"+
            "</tr>"+
            "<tr>"+
            "<td>"+ classJSON['Druid']['Class Features']['Wild Shape']['Beast Shapes']['table']['Level'][1]+"</td>"+
            "<td>"+ classJSON['Druid']['Class Features']['Wild Shape']['Beast Shapes']['table']['Max CR'][1] +"</td>"+
            "<td>"+ classJSON['Druid']['Class Features']['Wild Shape']['Beast Shapes']['table']['Limitations'][1]+"</td>"+
            "<td>"+ classJSON['Druid']['Class Features']['Wild Shape']['Beast Shapes']['table']['Example'][1] +"</td>"+
            "</tr>"+
            "<tr>"+
            "<td>"+ classJSON['Druid']['Class Features']['Wild Shape']['Beast Shapes']['table']['Level'][2]+"</td>"+
            "<td>"+ classJSON['Druid']['Class Features']['Wild Shape']['Beast Shapes']['table']['Max CR'][2] +"</td>"+
            "<td>"+ classJSON['Druid']['Class Features']['Wild Shape']['Beast Shapes']['table']['Limitations'][2]+"</td>"+
            "<td>"+ classJSON['Druid']['Class Features']['Wild Shape']['Beast Shapes']['table']['Example'][2] +"</td>"+
            "</tr>"+
            "</table><br>";
            
            
            lvl2Features+=classJSON['Druid']['Class Features']['Wild Shape']['Beast Shapes']['Rules']+"<br>";
            lvl2Features+=classJSON['Druid']['Class Features']['Wild Shape']['Beast Shapes']['content']+"<br><br>";
            
            
            var lvl2String="<br>";
            lvl2String+="<button class=\"collapsible\">Wild Shape</button><div class=\"content\">";
            lvl2String+="<br>"+classJSON['Druid']['Class Features']['Wild Shape']['content']+"<br><br>";
            lvl2String+="<button class=\"collapsible\">Wild Shape Table</button><div class=\"content\">";
            lvl2String+="<br>"+
                "<table>"+
            "<tr>"+
            "<th>Level</th><th>Max CR</th><th>Limitations</th><th>Example</th>"+    
            "</tr>"+
            "<tr>"+
            "<td>"+ classJSON['Druid']['Class Features']['Wild Shape']['Beast Shapes']['table']['Level'][0]+"</td>"+
            "<td>"+ classJSON['Druid']['Class Features']['Wild Shape']['Beast Shapes']['table']['Max CR'][0] +"</td>"+
            "<td>"+ classJSON['Druid']['Class Features']['Wild Shape']['Beast Shapes']['table']['Limitations'][0]+"</td>"+
            "<td>"+ classJSON['Druid']['Class Features']['Wild Shape']['Beast Shapes']['table']['Example'][0] +"</td>"+
            "</tr>"+
            "<tr>"+
            "<td>"+ classJSON['Druid']['Class Features']['Wild Shape']['Beast Shapes']['table']['Level'][1]+"</td>"+
            "<td>"+ classJSON['Druid']['Class Features']['Wild Shape']['Beast Shapes']['table']['Max CR'][1] +"</td>"+
            "<td>"+ classJSON['Druid']['Class Features']['Wild Shape']['Beast Shapes']['table']['Limitations'][1]+"</td>"+
            "<td>"+ classJSON['Druid']['Class Features']['Wild Shape']['Beast Shapes']['table']['Example'][1] +"</td>"+
            "</tr>"+
            "<tr>"+
            "<td>"+ classJSON['Druid']['Class Features']['Wild Shape']['Beast Shapes']['table']['Level'][2]+"</td>"+
            "<td>"+ classJSON['Druid']['Class Features']['Wild Shape']['Beast Shapes']['table']['Max CR'][2] +"</td>"+
            "<td>"+ classJSON['Druid']['Class Features']['Wild Shape']['Beast Shapes']['table']['Limitations'][2]+"</td>"+
            "<td>"+ classJSON['Druid']['Class Features']['Wild Shape']['Beast Shapes']['table']['Example'][2] +"</td>"+
            "</tr>"+
            "</table><br>"+"</div><br><br>";
            lvl2String+="<button class=\"collapsible\">Rules</button><div class=\"content\">";
            lvl2String+="<br>"+classJSON['Druid']['Class Features']['Wild Shape']['Beast Shapes']['Rules']+
            "<br>"+classJSON['Druid']['Class Features']['Wild Shape']['Beast Shapes']['content'].join(" ")+"</div><br></div><br>";
            
            
            
            lvl2Features+="<b>Druid Circle:</b><br>";
            lvl2Features+=classJSON['Druid']['Class Features']['Druid Circle']+"<br><br>";
            lvl2Features+="<b>Circle of the Land:</b><br>";
            lvl2Features+=classJSON['Druid']['Class Features']['Circle of the Land']['content']+"<br><br>";
            lvl2Features+="<b>Bonus Cantrip:</b><br>";
            lvl2Features+=classJSON['Druid']['Class Features']['Circle of the Land']['Bonus Cantrip']+"<br><br>";
            lvl2Features+="<b>Natural Recovery</b><br>";
            lvl2Features+=classJSON['Druid']['Class Features']['Circle of the Land']['Natural Recovery']['content'].join(" ");
            
            lvl2String+="<button class=\"collapsible\">Druid Circle</button><div class=\"content\">";
            lvl2String+="<br>"+classJSON['Druid']['Class Features']['Druidi Circle']+"</div><br>";
            lvl2String+="<button class=\"collapsible\">Circle of the Land</button><div class=\"content\">";
            lvl2String+="<br>"+classJSON['Druid']['Class Features']['Circle of the Land']['content']+"<br><br>";
            lvl2String+="<button class=\"collapsible\">Bonus Cantrip</button><div class=\"content\">";
            lvl2String+="<br>"+classJSON['Druid']['Class Features']['Circle of the Land']['Bonus Cantrip']+"</div><br><br>";
            lvl2String+="<button class=\"collapsible\">Natural Recovery</button><div class=\"content\">";
            lvl2String+="<br>"+classJSON['Druid']['Class Features']['Circle of the Land']['Natural Recovery']['content'].join(" ")+"</div><br><br>";
            
            
            
            
            lvl2Features+=classJSON['Druid']['Class Features']['Circle of the Land']['Circle Spells']['content'].join(" ")+"<br><br>";
            
            lvl2String+="<button class=\"collapsible\">Circle Spells</button><div class=\"content\">";
            lvl2String+="<br>"+classJSON['Druid']['Class Features']['Circle of the Land']['Circle Spells']['content'].join(" ")+"<br>";
            
           
            
            
            
            /*artic*/
            lvl2String+="<button class=\"collapsible\">Artic</button><div class=\"content\">";
            lvl2String+="<br><table>"+
            "<tr>"+
            "<th>Druid Level</th><th>Circle Spells</th>"+    
            "</tr>"+
            "<tr>"+
            "<td>"+ classJSON['Druid']['Class Features']['Circle of the Land']['Circle Spells']['Arctic']['table']['Druid Level'][0] +"</td>"+
            "<td>"+ classJSON['Druid']['Class Features']['Circle of the Land']['Circle Spells']['Arctic']['table']['Circle Spells'][0] +"</td>"+
            "</tr>"+
            "<tr>"+
            "<td>"+ classJSON['Druid']['Class Features']['Circle of the Land']['Circle Spells']['Arctic']['table']['Druid Level'][1] +"</td>"+
            "<td>"+ classJSON['Druid']['Class Features']['Circle of the Land']['Circle Spells']['Arctic']['table']['Circle Spells'][1] +"</td>"+
            "</tr>"+
            "<tr>"+
            "<td>"+ classJSON['Druid']['Class Features']['Circle of the Land']['Circle Spells']['Arctic']['table']['Druid Level'][2] +"</td>"+
            "<td>"+ classJSON['Druid']['Class Features']['Circle of the Land']['Circle Spells']['Arctic']['table']['Circle Spells'][2] +"</td>"+
            "</tr>"+
            "<tr>"+
            "<td>"+ classJSON['Druid']['Class Features']['Circle of the Land']['Circle Spells']['Arctic']['table']['Druid Level'][3] +"</td>"+
            "<td>"+ classJSON['Druid']['Class Features']['Circle of the Land']['Circle Spells']['Arctic']['table']['Circle Spells'][3] +"</td>"+
            "</tr>"+
            "</table></div><br><br>";
            
            
            /*coast table*/
            lvl2String+="<button class=\"collapsible\">Coast</button><div class=\"content\">";
            lvl2String+="<br><table>"+
            "<tr>"+
            "<th>Druid Level</th><th>Circle Spells</th>"+    
            "</tr>"+
            "<tr>"+
            "<td>"+ classJSON['Druid']['Class Features']['Circle of the Land']['Circle Spells']['Coast']['table']['Druid Level'][0] +"</td>"+
            "<td>"+ classJSON['Druid']['Class Features']['Circle of the Land']['Circle Spells']['Coast']['table']['Circle Spells'][0] +"</td>"+
            "</tr>"+
            "<tr>"+
            "<td>"+ classJSON['Druid']['Class Features']['Circle of the Land']['Circle Spells']['Coast']['table']['Druid Level'][1] +"</td>"+
            "<td>"+ classJSON['Druid']['Class Features']['Circle of the Land']['Circle Spells']['Coast']['table']['Circle Spells'][1] +"</td>"+
            "</tr>"+
            "<tr>"+
            "<td>"+ classJSON['Druid']['Class Features']['Circle of the Land']['Circle Spells']['Coast']['table']['Druid Level'][2] +"</td>"+
            "<td>"+ classJSON['Druid']['Class Features']['Circle of the Land']['Circle Spells']['Coast']['table']['Circle Spells'][2] +"</td>"+
            "</tr>"+
            "<tr>"+
            "<td>"+ classJSON['Druid']['Class Features']['Circle of the Land']['Circle Spells']['Coast']['table']['Druid Level'][3] +"</td>"+
            "<td>"+ classJSON['Druid']['Class Features']['Circle of the Land']['Circle Spells']['Coast']['table']['Circle Spells'][3] +"</td>"+
            "</tr>"+
            "</table></div><br><br>";
            
            
            
            /*desert table*/
            lvl2String+="<button class=\"collapsible\">Desert</button><div class=\"content\">";
            lvl2String+="<br><table>"+
            "<tr>"+
            "<th>Druid Level</th><th>Circle Spells</th>"+    
            "</tr>"+
            "<tr>"+
            "<td>"+ classJSON['Druid']['Class Features']['Circle of the Land']['Circle Spells']['Desert']['table']['Druid Level'][0] +"</td>"+
            "<td>"+ classJSON['Druid']['Class Features']['Circle of the Land']['Circle Spells']['Desert']['table']['Circle Spells'][0] +"</td>"+
            "</tr>"+
            "<tr>"+
            "<td>"+ classJSON['Druid']['Class Features']['Circle of the Land']['Circle Spells']['Desert']['table']['Druid Level'][1] +"</td>"+
            "<td>"+ classJSON['Druid']['Class Features']['Circle of the Land']['Circle Spells']['Desert']['table']['Circle Spells'][1] +"</td>"+
            "</tr>"+
            "<tr>"+
            "<td>"+ classJSON['Druid']['Class Features']['Circle of the Land']['Circle Spells']['Desert']['table']['Druid Level'][2] +"</td>"+
            "<td>"+ classJSON['Druid']['Class Features']['Circle of the Land']['Circle Spells']['Desert']['table']['Circle Spells'][2] +"</td>"+
            "</tr>"+
            "<tr>"+
            "<td>"+ classJSON['Druid']['Class Features']['Circle of the Land']['Circle Spells']['Desert']['table']['Druid Level'][3] +"</td>"+
            "<td>"+ classJSON['Druid']['Class Features']['Circle of the Land']['Circle Spells']['Desert']['table']['Circle Spells'][3] +"</td>"+
            "</tr>"+
            "</table></div><br><br>";
            
            
            
            lvl2String+="<button class=\"collapsible\">Forest</button><div class=\"content\">";
            
            /*forest table*/
            lvl2String+="<br><table>"+
            "<tr>"+
            "<th>Druid Level</th><th>Circle Spells</th>"+    
            "</tr>"+
            "<tr>"+
            "<td>"+ classJSON['Druid']['Class Features']['Circle of the Land']['Circle Spells']['Forest']['table']['Druid Level'][0] +"</td>"+
            "<td>"+ classJSON['Druid']['Class Features']['Circle of the Land']['Circle Spells']['Forest']['table']['Circle Spells'][0] +"</td>"+
            "</tr>"+
            "<tr>"+
            "<td>"+ classJSON['Druid']['Class Features']['Circle of the Land']['Circle Spells']['Forest']['table']['Druid Level'][1] +"</td>"+
            "<td>"+ classJSON['Druid']['Class Features']['Circle of the Land']['Circle Spells']['Forest']['table']['Circle Spells'][1] +"</td>"+
            "</tr>"+
            "<tr>"+
            "<td>"+ classJSON['Druid']['Class Features']['Circle of the Land']['Circle Spells']['Forest']['table']['Druid Level'][2] +"</td>"+
            "<td>"+ classJSON['Druid']['Class Features']['Circle of the Land']['Circle Spells']['Forest']['table']['Circle Spells'][2] +"</td>"+
            "</tr>"+
            "<tr>"+
            "<td>"+ classJSON['Druid']['Class Features']['Circle of the Land']['Circle Spells']['Forest']['table']['Druid Level'][3] +"</td>"+
            "<td>"+ classJSON['Druid']['Class Features']['Circle of the Land']['Circle Spells']['Forest']['table']['Circle Spells'][3] +"</td>"+
            "</tr>"+
            "</table></div><br><br>";
            
            
            lvl2String+="<button class=\"collapsible\">Grassland</button><div class=\"content\">";
            /*grassland table*/
            lvl2String+="<br><table>"+
            "<tr>"+
            "<th>Druid Level</th><th>Circle Spells</th>"+    
            "</tr>"+
            "<tr>"+
            "<td>"+ classJSON['Druid']['Class Features']['Circle of the Land']['Circle Spells']['Grassland']['table']['Druid Level'][0] +"</td>"+
            "<td>"+ classJSON['Druid']['Class Features']['Circle of the Land']['Circle Spells']['Grassland']['table']['Circle Spells'][0] +"</td>"+
            "</tr>"+
            "<tr>"+
            "<td>"+ classJSON['Druid']['Class Features']['Circle of the Land']['Circle Spells']['Grassland']['table']['Druid Level'][1] +"</td>"+
            "<td>"+ classJSON['Druid']['Class Features']['Circle of the Land']['Circle Spells']['Grassland']['table']['Circle Spells'][1] +"</td>"+
            "</tr>"+
            "<tr>"+
            "<td>"+ classJSON['Druid']['Class Features']['Circle of the Land']['Circle Spells']['Grassland']['table']['Druid Level'][2] +"</td>"+
            "<td>"+ classJSON['Druid']['Class Features']['Circle of the Land']['Circle Spells']['Grassland']['table']['Circle Spells'][2] +"</td>"+
            "</tr>"+
            "<tr>"+
            "<td>"+ classJSON['Druid']['Class Features']['Circle of the Land']['Circle Spells']['Grassland']['table']['Druid Level'][3] +"</td>"+
            "<td>"+ classJSON['Druid']['Class Features']['Circle of the Land']['Circle Spells']['Grassland']['table']['Circle Spells'][3] +"</td>"+
            "</tr>"+
            "</table></div><br><br>";
            
            
            
            lvl2String+="<button class=\"collapsible\">Mountain</button><div class=\"content\">";
            /*mountain table*/
            lvl2String+="<br><table>"+
            "<tr>"+
            "<th>Druid Level</th><th>Circle Spells</th>"+    
            "</tr>"+
            "<tr>"+
            "<td>"+ classJSON['Druid']['Class Features']['Circle of the Land']['Circle Spells']['Mountain']['table']['Druid Level'][0] +"</td>"+
            "<td>"+ classJSON['Druid']['Class Features']['Circle of the Land']['Circle Spells']['Mountain']['table']['Circle Spells'][0] +"</td>"+
            "</tr>"+
            "<tr>"+
            "<td>"+ classJSON['Druid']['Class Features']['Circle of the Land']['Circle Spells']['Mountain']['table']['Druid Level'][1] +"</td>"+
            "<td>"+ classJSON['Druid']['Class Features']['Circle of the Land']['Circle Spells']['Mountain']['table']['Circle Spells'][1] +"</td>"+
            "</tr>"+
            "<tr>"+
            "<td>"+ classJSON['Druid']['Class Features']['Circle of the Land']['Circle Spells']['Mountain']['table']['Druid Level'][2] +"</td>"+
            "<td>"+ classJSON['Druid']['Class Features']['Circle of the Land']['Circle Spells']['Mountain']['table']['Circle Spells'][2] +"</td>"+
            "</tr>"+
            "<tr>"+
            "<td>"+ classJSON['Druid']['Class Features']['Circle of the Land']['Circle Spells']['Mountain']['table']['Druid Level'][3] +"</td>"+
            "<td>"+ classJSON['Druid']['Class Features']['Circle of the Land']['Circle Spells']['Mountain']['table']['Circle Spells'][3] +"</td>"+
            "</tr>"+
            "</table></div><br><br>";
            
            lvl2String+="<button class=\"collapsible\">Swamp</button><div class=\"content\">";
            /*swamp table*/
            lvl2String+="<br><table>"+
            "<tr>"+
            "<th>Druid Level</th><th>Circle Spells</th>"+    
            "</tr>"+
            "<tr>"+
            "<td>"+ classJSON['Druid']['Class Features']['Circle of the Land']['Circle Spells']['Swamp']['table']['Druid Level'][0] +"</td>"+
            "<td>"+ classJSON['Druid']['Class Features']['Circle of the Land']['Circle Spells']['Swamp']['table']['Circle Spells'][0] +"</td>"+
            "</tr>"+
            "<tr>"+
            "<td>"+ classJSON['Druid']['Class Features']['Circle of the Land']['Circle Spells']['Swamp']['table']['Druid Level'][1] +"</td>"+
            "<td>"+ classJSON['Druid']['Class Features']['Circle of the Land']['Circle Spells']['Swamp']['table']['Circle Spells'][1] +"</td>"+
            "</tr>"+
            "<tr>"+
            "<td>"+ classJSON['Druid']['Class Features']['Circle of the Land']['Circle Spells']['Swamp']['table']['Druid Level'][2] +"</td>"+
            "<td>"+ classJSON['Druid']['Class Features']['Circle of the Land']['Circle Spells']['Swamp']['table']['Circle Spells'][2] +"</td>"+
            "</tr>"+
            "<tr>"+
            "<td>"+ classJSON['Druid']['Class Features']['Circle of the Land']['Circle Spells']['Swamp']['table']['Druid Level'][3] +"</td>"+
            "<td>"+ classJSON['Druid']['Class Features']['Circle of the Land']['Circle Spells']['Swamp']['table']['Circle Spells'][3] +"</td>"+
            "</tr>"+
            "</table></div><br><br></div><br></div></div>";
            
            
            
            
            document.getElementsByClassName("lvlContent")[1].innerHTML=lvl2String;
        }
        
        /*3rd level is spells*/
        
        
        //use this string for levels 4, 8, 12, 16, and 19
        var asiString="<br><br>";
        asiString+="<button class=\"collapsible\">Ability Score Improvement:</button><div class=\"content\">";
        asiString+="<br>"+classJSON['Druid']['Class Features']['Ability Score Improvement']+"</div><br><br>";
        
        if(level>=4){
            document.getElementsByClassName("lvlContent")[3].innerHTML=asiString;
        }
        
        /*level 5 is spells*/
        if(level>=6){
            
            var lvl6String="<br>";
            lvl6String+="<button class=\"collapsible\">Circle of the Land</button><div class=\"content\">";
            lvl6String+="<br><button class=\"collapsible\">Land's Stride</button><div class=\"content\">";
            lvl6String+="<br>"+classJSON['Druid']['Class Features']['Circle of the Land']['Lands Stride']['content'].join(" ")+"</div><br></div><br>";
            document.getElementsByClassName("lvlContent")[5].innerHTML=lvl6String;
        }
        
        if(level>=8){
            document.getElementsByClassName("lvlContent")[7].innerHTML=asiString;
        }
        
        /*nothing new until level 10*/
        if(level>=10){
            
            
            var lvl10String="<br>";
            lvl10String+="<button class=\"collapsible\">Circle of the Land</button><div class=\"content\">";
            lvl10String+="<br><button class=\"collapsible\">Nature's Ward</button><div class=\"content\">";
            lvl10String+="<br>"+classJSON['Druid']['Class Features']['Circle of the Land']['Natures Ward']+"</div><br></div><br>";
            document.getElementsByClassName("lvlContent")[9].innerHTML=lvl10String;
        }
        
        if(level>=12){
            document.getElementsByClassName("lvlContent")[11].innerHTML=asiString;
        }
        
        /*nothing until level 14*/
        if(level>=14){
            
            var lvl14String="<br>";
            lvl14String+="<button class=\"collapsible\">Circle of the Land</button><div class=\"content\">";
            lvl14String+="<br><button class=\"collapsible\">Nature's Sanctuary</button><div class=\"content\">";
            lvl14String+="<br>"+classJSON['Druid']['Class Features']['Circle of the Land']['Natures Sanctuary']['content'].join(" ")+"</div><br></div><br>";
            document.getElementsByClassName("lvlContent")[13].innerHTML=lvl14String;
        }
        
        if(level>=16){
            document.getElementsByClassName("lvlContent")[15].innerHTML=asiString;
        }
        
        /*nothing until level 18*/
        if(level>=18){
            
            
            var lvl18String="<br>";
            lvl18String+="<button class=\"collapsible\">Timeless Body</button><div class=\"content\">";
            lvl18String+="<br>"+classJSON['Druid']['Class Features']['Timeless Body']+"</div><br><br>";
            lvl18String+="<button class=\"collapsible\">Beast Spells</button><div class=\"content\">";
            lvl18String+="<br>"+classJSON['Druid']['Class Features']['Beast Spells']+"</div><br><br>";
            document.getElementsByClassName("lvlContent")[17].innerHTML=lvl18String;
        }
        
        if(level>=19){
            document.getElementsByClassName("lvlContent")[18].innerHTML=asiString;
        }
        
                
        if(level==20){
            
            
            var lvl20String="<br>";
            lvl20String+="<button class=\"collapsible\">Archdruid</button><div class=\"content\">";
            lvl20String+="<br>"+classJSON['Druid']['Class Features']['Archdruid']['content'].join(" ")+"</div><br><br>";
            
            document.getElementsByClassName("lvlContent")[19].innerHTML=lvl20String;
        }
        
        
        
        
        var druidCantrips = spellJSON['Spellcasting']['Spell Lists']['Druid Spells']['Cantrips (0 Level)'];
        var druidLvl1Spells = spellJSON['Spellcasting']['Spell Lists']['Druid Spells']['1st Level'];
        var allSpells = spellJSON['Spellcasting']['Spell Descriptions'];
        
        
        //var spellsElement = document.getElementById("final spells");
        var spell1String="<br><br>";
        var cantripString="<br><br>";
        for(var i=0;i<druidCantrips.length;i++){
            cantripString+="<button class=\"collapsible\">"+druidCantrips[i]+"</button><div class=\"content\">";
            cantripString+=allSpells[druidCantrips[i]]['content'].join("<br>")+"</div><br><br>";
        }
        for(var i=0;i<druidLvl1Spells.length;i++){
            spell1String+="<button class=\"collapsible\">"+druidLvl1Spells[i]+"</button><div class=\"content\">";
            spell1String+=allSpells[druidLvl1Spells[i]]['content'].join("<br>")+"</div><br><br>";
        }
        
        document.getElementsByClassName("mainContent")[0].innerHTML=cantripString;
        document.getElementsByClassName("mainContent")[1].innerHTML=spell1String;
        
        
        if(level>=3){
            var druidLvl2Spells = spellJSON['Spellcasting']['Spell Lists']['Druid Spells']['2nd Level'];
            var spell2String="<br><br>";
            for(var i=0;i<druidLvl2Spells.length;i++){
                spell2String+="<button class=\"collapsible\">"+druidLvl2Spells[i]+"</button><div class=\"content\">";
                spell2String+=allSpells[druidLvl2Spells[i]]['content'].join("<br>")+"</div><br><br>";
            }
            document.getElementsByClassName("mainContent")[2].innerHTML=spell2String;
        }
        
        if(level>=5){
            var druidLvl3Spells = spellJSON['Spellcasting']['Spell Lists']['Druid Spells']['3rd Level'];
            var spell3String="<br><br>";
            for(var i=0;i<druidLvl3Spells.length;i++){
                spell3String+="<button class=\"collapsible\">"+druidLvl3Spells[i]+"</button><div class=\"content\">";
                spell3String+=allSpells[druidLvl3Spells[i]]['content'].join("<br>")+"</div><br><br>";
            }
            document.getElementsByClassName("mainContent")[3].innerHTML=spell3String;
        }
        
        if(level>=7){
            var druidLvl4Spells = spellJSON['Spellcasting']['Spell Lists']['Druid Spells']['4th Level'];
            var spell4String="<br><br>";
            for(var i=0;i<druidLvl4Spells.length;i++){
                spell4String+="<button class=\"collapsible\">"+druidLvl4Spells[i]+"</button><div class=\"content\">";
                spell4String+=allSpells[druidLvl4Spells[i]]['content'].join("<br>")+"</div><br><br>";
            }
            document.getElementsByClassName("mainContent")[4].innerHTML=spell4String;
        }
        
        if(level>=9){
            var druidLvl5Spells = spellJSON['Spellcasting']['Spell Lists']['Druid Spells']['5th Level'];
            var spell5String="<br><br>";
            for(var i=0;i<druidLvl5Spells.length;i++){
                spell5String+="<button class=\"collapsible\">"+druidLvl5Spells[i]+"</button><div class=\"content\">";
                spell5String+=allSpells[druidLvl5Spells[i]]['content'].join("<br>")+"</div><br><br>";
            }
            document.getElementsByClassName("mainContent")[5].innerHTML=spell5String;
        }
        
        if(level>=11){
            var druidLvl6Spells = spellJSON['Spellcasting']['Spell Lists']['Druid Spells']['6th Level'];
            var spell6String="<br><br>";
            for(var i=0;i<druidLvl6Spells.length;i++){
                spell6String+="<button class=\"collapsible\">"+druidLvl6Spells[i]+"</button><div class=\"content\">";
                spell6String+=allSpells[druidLvl6Spells[i]]['content'].join("<br>")+"</div><br><br>";
            }
            document.getElementsByClassName("mainContent")[6].innerHTML=spell6String;
        }
        
        if(level>=13){
            var druidLvl7Spells = spellJSON['Spellcasting']['Spell Lists']['Druid Spells']['7th Level'];
            var spell7String="<br><br>";
            for(var i=0;i<druidLvl7Spells.length;i++){
                spell7String+="<button class=\"collapsible\">"+druidLvl7Spells[i]+"</button><div class=\"content\">";
                spell7String+=allSpells[druidLvl7Spells[i]]['content'].join("<br>")+"</div><br><br>";
            }
            document.getElementsByClassName("mainContent")[7].innerHTML=spell7String;
        }
        
        if(level>=15){
            var druidLvl8Spells = spellJSON['Spellcasting']['Spell Lists']['Druid Spells']['8th Level'];
            var spell8String="<br><br>";
            for(var i=0;i<druidLvl8Spells.length;i++){
                spell8String+="<button class=\"collapsible\">"+druidLvl8Spells[i]+"</button><div class=\"content\">";
                spell8String+=allSpells[druidLvl8Spells[i]]['content'].join("<br>")+"</div><br><br>";
            }
            document.getElementsByClassName("mainContent")[8].innerHTML=spell8String;
        }
        
        if(level>=17){
            var druidLvl9Spells = spellJSON['Spellcasting']['Spell Lists']['Druid Spells']['9th Level'];
            var spell9String="<br><br>";
            for(var i=0;i<druidLvl9Spells.length;i++){
                spell9String+="<button class=\"collapsible\">"+druidLvl9Spells[i]+"</button><div class=\"content\">";
                spell9String+=allSpells[druidLvl9Spells[i]]['content'].join("<br>")+"</div><br><br>";
            }
            document.getElementsByClassName("mainContent")[9].innerHTML=spell9String;
        }
        
        
        
        //spellsElement.innerHTML=spellString;
        
        
        
        
    }
    else if(charClass=="fighter"){
        
        
        /*basic features for classes include hit points, proficiencies, and equipment*/
        basicFeaturesString+="<br><br>Hit Points: <br>" + classJSON['Fighter']['Class Features']['Hit Points']['content'][0] + "<br>";
        basicFeaturesString+=classJSON['Fighter']['Class Features']['Hit Points']['content'][1] + "<br>";
        basicFeaturesString+=classJSON['Fighter']['Class Features']['Hit Points']['content'][2] + "<br><br>";
        basicFeaturesString+="Proficiences:<br>";
        basicFeaturesString+=classJSON['Fighter']['Class Features']['Proficiencies']['content'][0]+"<br>";
        basicFeaturesString+=classJSON['Fighter']['Class Features']['Proficiencies']['content'][1]+"<br>";
        basicFeaturesString+=classJSON['Fighter']['Class Features']['Proficiencies']['content'][2]+"<br>";
        basicFeaturesString+=classJSON['Fighter']['Class Features']['Proficiencies']['content'][3]+"<br>";
        basicFeaturesString+=classJSON['Fighter']['Class Features']['Proficiencies']['content'][4]+" ";
        basicFeaturesString+=classJSON['Fighter']['Class Features']['Proficiencies']['content'][5]+"<br><br>";
        basicFeaturesString+="Equipment:<br>";
        basicFeaturesString+=classJSON['Druid']['Class Features']['Equipment']['content'][0]+"<br>";
        basicFeaturesString+="- " + classJSON['Fighter']['Class Features']['Equipment']['content'][1][0]+"<br>";
        basicFeaturesString+="- " + classJSON['Fighter']['Class Features']['Equipment']['content'][1][1]+"<br>";
        basicFeaturesString+="- " + classJSON['Fighter']['Class Features']['Equipment']['content'][1][2]+"<br>";

        basicFeatures.innerHTML=basicFeaturesString;
        
        
        
        
        var lvl1String="<br>";
        
        lvl1String+="<button class=\"collapsible\">Fighting Style</button><div class=\"content\">";
        lvl1String+="<br>"+classJSON['Fighter']['Class Features']['Fighting Style']['content']+"<br><br>";
        lvl1String+="<button class=\"collapsible\">Archery</button><div class=\"content\">";
        lvl1String+="<br>"+classJSON['Fighter']['Class Features']['Fighting Style']['Archery']+"</div><br><br>";
        lvl1String+="<button class=\"collapsible\">Defense</button><div class=\"content\">";
        lvl1String+="<br>"+classJSON['Fighter']['Class Features']['Fighting Style']['Defense']+"</div><br><br>";
        lvl1String+="<button class=\"collapsible\">Dueling</button><div class=\"content\">";
        lvl1String+="<br>"+classJSON['Fighter']['Class Features']['Fighting Style']['Dueling']+"</div><br><br>";
        lvl1String+="<button class=\"collapsible\">Great Weapon Fighting</button><div class=\"content\">";
        lvl1String+="<br>"+classJSON['Fighter']['Class Features']['Fighting Style']['Great Weapon Fighting']+"</div><br><br>";
        lvl1String+="<button class=\"collapsible\">Protection</button><div class=\"content\">";
        lvl1String+="<br>"+classJSON['Fighter']['Class Features']['Fighting Style']['Protection']+"</div><br><br>";
        lvl1String+="<button class=\"collapsible\">Two-Weapon Fighting</button><div class=\"content\">";
        lvl1String+="<br>"+classJSON['Fighter']['Class Features']['Fighting Style']['Two-Weapon Fighting']+"</div><br></div><br>";
        
        lvl1String+="<button class=\"collapsible\">Second Wind</button><div class=\"content\">";
        lvl1String+="<br>"+classJSON['Fighter']['Class Features']['Second Wind']+"</div><br><br>";
        document.getElementsByClassName("lvlContent")[0].innerHTML=lvl1String;
        
        
        if(level>=2){
            
            var lvl2String="<br>";
            lvl2String+="<button class=\"collapsible\">Action Surge</button><div class=\"content\">";
            lvl2String+="<br>"+classJSON['Fighter']['Class Features']['Action Surge']['content'].join(" ")+"</div><br><br>";
            document.getElementsByClassName("lvlContent")[1].innerHTML=lvl2String;
        }
        
        if(level>=3){
            
            var lvl3String="<br>";
            lvl3String+="<button class=\"collapsible\">Martial Archetype</button><div class=\"content\">";
            lvl3String+="<br>"+classJSON['Fighter']['Class Features']['Martial Archetype']+"</div><br><br>";
            lvl3String+="<button class=\"collapsible\">Martial Archetypes</button><div class=\"content\">";
            lvl3String+="<br>"+classJSON['Fighter']['Martial Archetypes']['content']+"<br><br>";
            lvl3String+="<button class=\"collapsible\">Champion</button><div class=\"content\">";
            lvl3String+="<br>"+classJSON['Fighter']['Martial Archetypes']['Champion']['content']+"<br><br>";
            lvl3String+="<button class=\"collapsible\">Improved Critical</button><div class=\"content\">";
            lvl3String+="<br>"+classJSON['Fighter']['Martial Archetypes']['Champion']['Improved Critical']+"</div><br></div><br></div><br>";
            document.getElementsByClassName("lvlContent")[2].innerHTML=lvl3String;
        }
        
        
        
        //use this string for levels 4, 6, 8, 12, 14, 16, and 19
        var asiString="<br><br>";
        asiString+="<button class=\"collapsible\">Ability Score Improvement:</button><div class=\"content\">";
        asiString+="<br>"+classJSON['Druid']['Class Features']['Ability Score Improvement']+"</div><br><br>";
        
        if(level>=4){
            document.getElementsByClassName("lvlContent")[3].innerHTML=asiString;
        }
        
        if(level>=5){
            
            var lvl5String="<br>";
            lvl5String+="<button class=\"collapsible\">Extra Attack</button><div class=\"content\">";
            lvl5String+="<br>"+classJSON['Fighter']['Class Features']['Extra Attack']['content'].join(" ")+"</div><br><br>";
            document.getElementsByClassName("lvlContent")[4].innerHTML=lvl5String;
        }
        
        if(level>=6){
            document.getElementsByClassName("lvlContent")[5].innerHTML=asiString;
        }
        
        if(level>=7){
            
            var lvl7String="<br>";
            lvl7String+="<button class=\"collapsible\">Champion</button><div class=\"content\">";
            lvl7String+="<br><button class=\"collapsible\">Remarkable Athlete</button><div class=\"content\">";
            lvl7String+="<br>"+classJSON['Fighter']['Martial Archetypes']['Champion']['Remarkable Athlete']['content'].join(" ")+"</div><br><br></div><br>";
            document.getElementsByClassName("lvlContent")[6].innerHTML=lvl7String;
        }
        
        if(level>=8){
            document.getElementsByClassName("lvlContent")[7].innerHTML=asiString;
        }
        
        if(level>=9){
            lvl9Features+="<b>Indomitable:</b><br>";
            lvl9Features+=classJSON['Fighter']['Class Features']['Indomitable']['content'].join("");
            
            lvl9Element.innerHTML=lvl9Features;
            
            var lvl9String="<br>";
            lvl9String+="<button class=\"collapsible\">Indomitable</button><div class=\"content\">";
            lvl9String+="<br>"+classJSON['Fighter']['Class Features']['Indomitable']['content'].join(" ")+"</div><br><br>";
            document.getElementsByClassName("lvlContent")[8].innerHTML=lvl9String;
        }
        
        if(level>=10){
            lvl10Features+="<b>Additional Fighting Style:</b><br>";
            lvl10Features+=classJSON['Fighter']['Martial Archetypes']['Champion']['Additional Fighting Style']; 
            
            lvl10Element.innerHTML=lvl10Features;
            
            var lvl10String="<br>";
            lvl10String+="<button class=\"collapsible\">Champion</button><div class=\"content\">";
            lvl10String+="<br><button class=\"collapsible\">Additional Fighting Style</button><div class=\"content\">";
            lvl10String+="<br>"+classJSON['Fighter']['Martial Archetypes']['Champion']['Additional Fighting Style']+"</div><br><br></div><br>";
            document.getElementsByClassName("lvlContent")[9].innerHTML=lvl10String;
        }
        
        if(level>=12){
            document.getElementsByClassName("lvlContent")[11].innerHTML=asiString;
        }
        
        if(level>=14){
            document.getElementsByClassName("lvlContent")[13].innerHTML=asiString;
        }
        
        if(level>=15){
            lvl15Features+="<b>Superior Critical:</b><br>";
            lvl15Features+=classJSON['Fighter']['Martial Archetypes']['Champion']['Superior Critical'];
            
            lvl15Element.innerHTML=lvl15Features;
            
            var lvl15String="<br>";
            lvl15String+="<button class=\"collapsible\">Champion</button><div class=\"content\">";
            lvl15String+="<br><button class=\"collapsible\">Superior Critical</button><div class=\"content\">";
            lvl15String+="<br>"+classJSON['Fighter']['Martial Archetypes']['Champion']['Superior Critical']+"</div><br><br></div><br>";
            document.getElementsByClassName("lvlContent")[14].innerHTML=lvl15String;
        }
        
        if(level>=16){
            document.getElementsByClassName("lvlContent")[15].innerHTML=asiString;
        }
        
        if(level>=18){
            lvl18Features+="<b>Survivor:</b><br>";
            lvl18Features+=classJSON['Fighter']['Martial Archetypes']['Champion']['Survivor'];
            
            lvl18Element.innerHTML=lvl18Features;
            
            var lvl18String="<br>";
            lvl18String+="<button class=\"collapsible\">Champion</button><div class=\"content\">";
            lvl18String+="<br><button class=\"collapsible\">Remarkable Athlete</button><div class=\"content\">";
            lvl18String+="<br>"+classJSON['Fighter']['Martial Archetypes']['Champion']['Survivor']+"</div><br><br></div><br>";
            document.getElementsByClassName("lvlContent")[17].innerHTML=lvl18String;
        }
        
        if(level>=19){
            document.getElementsByClassName("lvlContent")[18].innerHTML=asiString;
        }
        
        
        
        
        
        
    }
    else if(charClass=="monk"){
        
        /*basic features for classes include hit points, proficiencies, and equipment*/
        basicFeaturesString+="<br><br>Hit Points: <br>" + classJSON['Monk']['Class Features']['Hit Points']['content'][0] + "<br>";
        basicFeaturesString+=classJSON['Monk']['Class Features']['Hit Points']['content'][1] + "<br>";
        basicFeaturesString+=classJSON['Monk']['Class Features']['Hit Points']['content'][2] + "<br><br>";
        basicFeaturesString+="Proficiences:<br>";
        basicFeaturesString+=classJSON['Monk']['Class Features']['Proficiencies']['content'][0]+"<br>";
        basicFeaturesString+=classJSON['Monk']['Class Features']['Proficiencies']['content'][1]+"<br>";
        basicFeaturesString+=classJSON['Monk']['Class Features']['Proficiencies']['content'][2]+"<br>";
        basicFeaturesString+=classJSON['Monk']['Class Features']['Proficiencies']['content'][3]+"<br>";
        basicFeaturesString+=classJSON['Monk']['Class Features']['Proficiencies']['content'][4]+" ";
        basicFeaturesString+=classJSON['Monk']['Class Features']['Proficiencies']['content'][5]+"<br><br>";
        basicFeaturesString+="Equipment:<br>";
        basicFeaturesString+=classJSON['Monk']['Class Features']['Equipment']['content'][0]+"<br>";
        basicFeaturesString+="- " + classJSON['Monk']['Class Features']['Equipment']['content'][1][0]+"<br>";
        basicFeaturesString+="- " + classJSON['Monk']['Class Features']['Equipment']['content'][1][1]+"<br>";
        basicFeaturesString+="- " + classJSON['Monk']['Class Features']['Equipment']['content'][1][2]+"<br>";

        basicFeatures.innerHTML=basicFeaturesString;
        
        
        lvl1Features+="<b>Unarmored Defense:</b><br>";
        lvl1Features+=classJSON['Monk']['Class Features']['Unarmored Defense']+"<br><br>";
        lvl1Features+="<b>Martial Arts:</b><br>";
        lvl1Features+=classJSON['Monk']['Class Features']['Martial Arts']['content'][0]+"<br>";
        lvl1Features+=classJSON['Monk']['Class Features']['Martial Arts']['content'][1]+"<br>";
        lvl1Features+=classJSON['Monk']['Class Features']['Martial Arts']['content'][2].join(" ")+" ";
        lvl1Features+=classJSON['Monk']['Class Features']['Martial Arts']['content'][3];
        
        lvl1Element.innerHTML=lvl1Features;
        
        if(level>=2){
            lvl2Features+="<b>Ki:</b><br>";
            lvl2Features+=classJSON['Monk']['Class Features']['Ki']['content'].join(" ")+"<br>";
            lvl2Features+="<b>Flurry of Blows:</b><br>";
            lvl2Features+=classJSON['Monk']['Class Features']['Ki']['Flurry of Blows']+"<br>";
            lvl2Features+="<b>Patient Defense:</b><br>";
            lvl2Features+=classJSON['Monk']['Class Features']['Ki']['Patient Defense']+"<br>";
            lvl2Features+="<b>Step of the Wind:</b><br>";
            lvl2Features+=classJSON['Monk']['Class Features']['Ki']['Step of the Wind']+"<br><br>";
            lvl2Features+="<b>Unarmored Movement:</b><br>";
            lvl2Features+=classJSON['Monk']['Class Features']['Unarmored Movement']['content'].join(" ");
            
            lvl2Element.innerHTML=lvl2Features;
        }
        
        if(level>=3){
            lvl3Features+="<b>Deflect Missiles:</b><br>";
            lvl3Features+=classJSON['Monk']['Class Features']['Deflect Missiles']['content'].join(" ")+"<br><br>";
            
            lvl3Features+="<b>Monastic Tradition:</b><br>";
            lvl3Features+=classJSON['Monk']['Class Features']['Monastic Tradition']+"<br><br>";
            lvl3Features+="<b>Monastic Traditions:</b><br>";
            lvl3Features+=classJSON['Monk']['Monastic Traditions']['content']+"<br><br>";
            lvl3Features+="<b>Way of the Open Hand:</b><br>";
            lvl3Features+=classJSON['Monk']['Monastic Traditions']['Way of the Open Hand']['content']+"<br><br>";
            lvl3Features+="<b>Open Hand Technique:</b><br>";
            lvl3Features+=classJSON['Monk']['Monastic Traditions']['Way of the Open Hand']['Open Hand Technique']['content'][0]+"<br><br>";
            lvl3Features+=classJSON['Monk']['Monastic Traditions']['Way of the Open Hand']['Open Hand Technique']['content'][1].join("<br>");
            
            lvl3Element.innerHTML=lvl3Features;
        }
        
        if(level>=4){
            lvl4Features+="<b>Ability Score Improvement:</b><br>";
            lvl4Features+=classJSON['Monk']['Class Features']['Ability Score Improvement']+"<br><br>"; 
            lvl4Features+="<b>Slow Fall:</b><br>";
            lvl4Features+=classJSON['Monk']['Class Features']['Slow Fall'];
            lvl4Element.innerHTML=lvl4Features;
        }
        
        
        if(level>=5){
            lvl5Features+="<b>Extra Attack:</b><br>";
            lvl5Features+=classJSON['Monk']['Class Features']['Extra Attack']+"<br><br>";
            lvl5Features+="<b>Stunning Strike:</b><br>";
            lvl5Features+=classJSON['Monk']['Class Features']['Stunning Strike'];
            
            lvl5Element.innerHTML=lvl5Features;
            
        }
        
        if(level>=6){
            lvl6Features+="<b>Ki-Empowered Strikes:</b><br>";
            lvl6Features+=classJSON['Monk']['Class Features']['Ki-Empowered Strikes']+"<br><br>";
            lvl6Features+="<b>Wholeness of Body:</b><br>";
            lvl6Features+=classJSON['Monk']['Monastic Traditions']['Way of the Open Hand']['Wholeness of Body'];
            
            lvl6Element.innerHTML=lvl6Features;
        }
        
        if(level>=7){
            lvl7Features+="<b>Evasion:</b><br>";
            lvl7Features+=classJSON['Monk']['Class Features']['Evasion']+"<br><br>";
            lvl7Features+="<b>Stillness of Mind:</b><br>";
            lvl7Features+=classJSON['Monk']['Class Features']['Stillness of Mind'];
            
            lvl7Element.innerHTML=lvl7Features;
        }
        
        /*8 is ASI, 9 is improved unarmored movement*/
        if(level>=10){
            lvl10Features+="<b>Purity of Body:</b><br>";
            lvl10Features+=classJSON['Monk']['Class Features']['Purity of Body'];
            
            lvl10Element.innerHTML=lvl10Features;
        }
        
        if(level>=11){
            lvl11Features+="<b>Tranquility:</b><br>";
            lvl11Features+=classJSON['Monk']['Monastic Traditions']['Way of the Open Hand']['Tranquility'];
            
            lvl11Element.innerHTML=lvl11Features;
        }
        
        /*12 is ASI*/
        if(level>=13){
            lvl13Features+="<b>Tongue of the Sun and Moon:</b><br>";
            lvl13Features+=classJSON['Monk']['Class Features']['Tongue of the Sun and Moon'];
            
            lvl13Element.innerHTML=lvl13Features;
            
        }
        
        
        if(level>=14){
            lvl14Features+="<b>Diamond Soul:</b><br>";
            lvl14Features+=classJSON['Monk']['Class Features']['Diamond Soul']['content'].join(" ");
            
            lvl14Element.innerHTML=lvl14Features;
        }
        
        if(level>=15){
            lvl15Features+="<b>Timeless Body:</b><br>";
            lvl15Features+=classJSON['Monk']['Class Features']['Timeless Body'];
            
            lvl15Element.innerHTML=lvl15Features;
        }
        
        /*16 is ASI*/
        if(level>=17){
            lvl17Features+="<b>Quivering Palm:</b><br>";
            lvl17Features+=classJSON['Monk']['Monastic Traditions']['Way of the Open Hand']['Quivering Palm']['content'].join(" "); 
            
            lvl17Element.innerHTML=lvl17Features;
        }
        
        if(level>=18){
            lvl18Features+="<b>Empty Body:</b><br>";
            lvl18Features+=classJSON['Monk']['Class Features']['Empty Body']['content'].join(" ");
            
            lvl18Element.innerHTML=lvl18Features;
            
        }
        
        /*19 is ASI*/
        
        if(level>=20){
            lvl20Features+="<b>Perfect Self:</b><br>";
            lvl20Features+=classJSON['Monk']['Class Features']['Perfect Self'];
            
            lvl20Element.innerHTML=lvl20Features;
        }
        
        
    }
    else if(charClass=="paladin"){
        
        /*basic features for classes include hit points, proficiencies, and equipment*/
        basicFeaturesString+="<br><br>Hit Points: <br>" + classJSON['Paladin']['Class Features']['Hit Points']['content'][0] + "<br>";
        basicFeaturesString+=classJSON['Paladin']['Class Features']['Hit Points']['content'][1] + "<br>";
        basicFeaturesString+=classJSON['Paladin']['Class Features']['Hit Points']['content'][2] + "<br><br>";
        basicFeaturesString+="Proficiences:<br>";
        basicFeaturesString+=classJSON['Paladin']['Class Features']['Proficiencies']['content'][0]+"<br>";
        basicFeaturesString+=classJSON['Paladin']['Class Features']['Proficiencies']['content'][1]+"<br>";
        basicFeaturesString+=classJSON['Paladin']['Class Features']['Proficiencies']['content'][2]+"<br>";
        basicFeaturesString+=classJSON['Paladin']['Class Features']['Proficiencies']['content'][3]+"<br>";
        basicFeaturesString+=classJSON['Paladin']['Class Features']['Proficiencies']['content'][4]+"<br><br>";
        basicFeaturesString+="Equipment:<br>";
        basicFeaturesString+=classJSON['Paladin']['Class Features']['Equipment']['content'][0]+"<br>";
        basicFeaturesString+="- " + classJSON['Paladin']['Class Features']['Equipment']['content'][1][0]+"<br>";
        basicFeaturesString+="- " + classJSON['Paladin']['Class Features']['Equipment']['content'][1][1]+"<br>";
        basicFeaturesString+="- " + classJSON['Paladin']['Class Features']['Equipment']['content'][1][2]+"<br>";
        
        basicFeatures+=classJSON['Paladin']['Sacred Oaths']['Breaking Your Oath']['content'];

        basicFeatures.innerHTML=basicFeaturesString;
        
        
        lvl1Features+="<b>Divine Sense:</b><br>";
        lvl1Features+=classJSON['Paladin']['Class Features']['Divine Sense']['content'].join(" ")+"<br><br>";
        lvl1Features+="<b>Lay on Hands:</b><br>";
        lvl1Features+=classJSON['Paladin']['Class Features']['Lay on Hands']['content'].join(" ");
        
        
        lvl1Element.innerHTML=lvl1Features;
        
        if(level>=2){
            lvl2Features+="<b>Fighting Style:</b><br>";
            lvl2Features+=classJSON['Paladin']['Class Features']['Fighting Style']['content']+"<br>";
            lvl2Features+="<b>Defense:</b><br>";
            lvl2Features+=classJSON['Paladin']['Class Features']['Fighting Style']['Defense']+"<br>";
            lvl2Features+="<b>Dueling:</b><br>";
            lvl2Features+=classJSON['Paladin']['Class Features']['Fighting Style']['Dueling']+"<br>";
            lvl2Features+="<b>Great Weapon Fighting:</b><br>";
            lvl2Features+=classJSON['Paladin']['Class Features']['Fighting Style']['Great Weapon Fighting']+"<br>";
            lvl2Features+="<b>Protection:</b><br>";
            lvl2Features+=classJSON['Paladin']['Class Features']['Fighting Style']['Protection']+"<br><br>";
            lvl2Features+="<b>Spellcasting:</b><br>";
            lvl2Features+=classJSON['Paladin']['Class Features']['Spellcasting']['content']+"<br><br>";
            lvl2Features+="<b>Preparing and Casting Spells:</b><br>";
            lvl2Features+=classJSON['Paladin']['Class Features']['Spellcasting']['Preparing and Casting Spells']['content'].join(" ")+"<br><br>";
            lvl2Features+="<b>Spellcasting Ability:</b><br>";
            lvl2Features+=classJSON['Paladin']['Class Features']['Spellcasting']['Spellcasting Ability']['content'].join("<br>")+"<br><br>";
            lvl2Features+="<b>Spellcasting Focus:</b><br>";
            lvl2Features+=classJSON['Paladin']['Class Features']['Spellcasting']['Spellcasting Focus']+"<br><br>";
            lvl2Features+="<b>Divine Smite:</b><br>";
            lvl2Features+=classJSON['Paladin']['Class Features']['Divine Smite'];
            
            lvl2Element.innerHTML=lvl2Features;
        }
        
        
        if(level>=3){
            lvl3Features+="<b>Divine Health:</b><br>";
            lvl3Features+=classJSON['Paladin']['Class Features']['Divine Health']+"<br><br>";
            lvl3Features+="<b>Sacred Oath:</b><br>";
            lvl3Features+=classJSON['Paladin']['Class Features']['Sacred Oath']['content']+"<br><br>";
            lvl3Features+="<b>Oath Spells:</b><br>";
            lvl3Features+=classJSON['Paladin']['Class Features']['Sacred Oath']['Oath Spells']['content']+"<br><br>";
            lvl3Features+="<b>Channel Divinity:</b><br>";
            lvl3Features+=classJSON['Paladin']['Class Features']['Sacred Oath']['Channel Divinity']['content']+"<br><br>";
            lvl3Features+="<b>Sacred Oaths:</b><br>";
            lvl3Features+=classJSON['Paladin']['Sacred Oaths']['content']+"<br><br>";
            lvl3Features+="<b>Oath of Devotion:</b><br>";
            lvl3Features+=classJSON['Paladin']['Sacred Oaths']['Oath of Devotion']['content']+"<br><br>";
            lvl3Features+="<b>Tenets of Devotion:</b><br>";
            lvl3Features+=classJSON['Paladin']['Sacred Oaths']['Oath of Devotion']['Tenets of Devotion']['content'].join("<br>")+"<br><br>";
            lvl3Features+="<b>Oath Spells:</b><br>";
            lvl3Features+=classJSON['Paladin']['Sacred Oaths']['Oath of Devotion']['Oath Spells']['content']+"<br><br>";
            
            /*oath spell table*/
            lvl3Features+="<table>"+
            "<tr>"+
            "<th>Level</th><th>Paladin Spells</th>"+    
            "</tr>"+
            "<tr>"+
            "<td>"+ classJSON['Paladin']['Sacred Oaths']['Oath of Devotion']['Oath Spells']['Oath of Devotion Spells']['table']['Level'][0] +"</td>"+
            "<td>"+ classJSON['Paladin']['Sacred Oaths']['Oath of Devotion']['Oath Spells']['Oath of Devotion Spells']['table']['Paladin Spells'][0] +
            "</td>"+
            "</tr>"+
            "<tr>"+
            "<td>"+ classJSON['Paladin']['Sacred Oaths']['Oath of Devotion']['Oath Spells']['Oath of Devotion Spells']['table']['Level'][1] +"</td>"+
            "<td>"+ classJSON['Paladin']['Sacred Oaths']['Oath of Devotion']['Oath Spells']['Oath of Devotion Spells']['table']['Paladin Spells'][1] +
            "</td>"+"</tr>"+
            "<tr>"+
            "<td>"+ classJSON['Paladin']['Sacred Oaths']['Oath of Devotion']['Oath Spells']['Oath of Devotion Spells']['table']['Level'][2] +"</td>"+
            "<td>"+ classJSON['Paladin']['Sacred Oaths']['Oath of Devotion']['Oath Spells']['Oath of Devotion Spells']['table']['Paladin Spells'][2] +
            "</td>"+"</tr>"+
            "<tr>"+
            "<td>"+ classJSON['Paladin']['Sacred Oaths']['Oath of Devotion']['Oath Spells']['Oath of Devotion Spells']['table']['Level'][3] +"</td>"+
            "<td>"+ classJSON['Paladin']['Sacred Oaths']['Oath of Devotion']['Oath Spells']['Oath of Devotion Spells']['table']['Paladin Spells'][3] +
            "</td>"+"</tr>"+
            "<tr>"+
            "<td>"+ classJSON['Paladin']['Sacred Oaths']['Oath of Devotion']['Oath Spells']['Oath of Devotion Spells']['table']['Level'][4] +"</td>"+
            "<td>"+ classJSON['Paladin']['Sacred Oaths']['Oath of Devotion']['Oath Spells']['Oath of Devotion Spells']['table']['Paladin Spells'][4] +
            "</td>"+"</tr>"+
            "</table><br><br>";

            
            
            lvl3Features+="<b>Channel Divinity:</b><br>";
            lvl3Features+=classJSON['Paladin']['Sacred Oaths']['Oath of Devotion']['Channel Divinity']['content'].join("<br>");  
            
            
            lvl3Element.innerHTML=lvl3Features;
        }
        
        if(level>=4){
            lvl4Features+="<b>Abililty Score Improvement:</b><br>";
            lvl4Features+=classJSON['Paladin']['Class Features']['Ability Score Improvement'];
            
            lvl4Element.innerHTML=lvl4Features;
        }
        
        if(level>=5){
            lvl5Features+="<b>Extra Attack:</b><br>";
            lvl5Features+=classJSON['Paladin']['Class Features']['Extra Attack'];
            
            lvl5Element.innerHTML=lvl5Features;
        }
        
        if(level>=6){
            lvl6Features+="<b>Aura of Protection:</b><br>";
            lvl6Features+=classJSON['Paladin']['Class Features']['Aura of Protection']['content'].join(" ");
            
            lvl6Element.innerHTML=lvl6Features;
            
        }
        
        if(level>=7){
            lvl7Features+="<b>Aura of Devotion:</b><br>";
            lvl7Features+=classJSON['Paladin']['Sacred Oaths']['Oath of Devotion']['Aura of Devotion']['content'].join(" ");
            
            lvl7Element.innerHTML=lvl7Features;
        }
        
        /*8 is ASI, 9 is spells*/
        
        if(level>=10){
            lvl10Features+="<b>Aura of Courage:</b><br>";
            lvl10Features+=classJSON['Paladin']['Class Features']['Aura of Courage']['content'].join(" ");
            
            lvl10Element.innerHTML=lvl10Features;
        }
        
        if(level>=11){
            lvl11Features+="<b>Improved Divine Smite:</b><br>";
            lvl11Features+=classJSON['Paladin']['Class Features']['Improved Divine Smite'];
            
            lvl11Element.innerHTML=lvl11Features;
        }
        
        /*12 is ASI, 13 is spells*/
        
        if(level>=14){
            lvl14Features+="<b>Cleansing Touch:</b><br>";
            lvl14Features+=classJSON['Paladin']['Class Features']['Cleansing Touch']['content'].join(" ");    
            
            lvl14Element.innerHTML=lvl14Features;
        }
        
        if(level>=15){
            lvl15Features+="<b>Purity of Spirit:</b><br>";
            lvl15Features+=classJSON['Paladin']['Sacred Oaths']['Oath of Devotion']['Purity of Spirit'];
            
            lvl15Element.innerHTML=lvl15Features;
        }
        
        if(level==20){
            lvl20Features+="<b>Holy Nimbus:</b><br>";
            lvl20Features+=classJSON['Paladin']['Sacred Oaths']['Oath of Devotion']['Holy Nimbus']['content'].join(" ");
            
            lvl20Element.innerHTML=lvl20Features;
        }
        
        
        
        
        var paladinLvl1Spells = spellJSON['Spellcasting']['Spell Lists']['Paladin Spells']['1st Level'];
        var allSpells = spellJSON['Spellcasting']['Spell Descriptions'];
        
        
        //var spellsElement = document.getElementById("final spells");
        var spell1String="<br><br>";
        if(level>=2){
            for(var i=0;i<paladinLvl1Spells.length;i++){
                spell1String+="<button class=\"collapsible\">"+paladinLvl1Spells[i]+"</button><div class=\"content\">";
                spell1String+=allSpells[paladinLvl1Spells[i]]['content'].join("<br>")+"</div><br><br>";
            }
            document.getElementsByClassName("mainContent")[1].innerHTML=spell1String;
        }
        
        if(level>=5){
            var paladinLvl2Spells = spellJSON['Spellcasting']['Spell Lists']['Paladin Spells']['2nd Level'];
            var spell2String="<br><br>";
            for(var i=0;i<paladinLvl2Spells.length;i++){
                spell2String+="<button class=\"collapsible\">"+paladinLvl2Spells[i]+"</button><div class=\"content\">";
                spell2String+=allSpells[paladinLvl2Spells[i]]['content'].join("<br>")+"</div><br><br>";
            }
            document.getElementsByClassName("mainContent")[2].innerHTML=spell2String;
        }
        
        if(level>=9){
            var paladinLvl3Spells = spellJSON['Spellcasting']['Spell Lists']['Paladin Spells']['3rd Level'];
            var spell3String="<br><br>";
            for(var i=0;i<paladinLvl3Spells.length;i++){
                spell3String+="<button class=\"collapsible\">"+paladinLvl3Spells[i]+"</button><div class=\"content\">";
                spell3String+=allSpells[paladinLvl3Spells[i]]['content'].join("<br>")+"</div><br><br>";
            }
            document.getElementsByClassName("mainContent")[3].innerHTML=spell3String;
        }
        
        if(level>=13){
            var paladinLvl4Spells = spellJSON['Spellcasting']['Spell Lists']['Paladin Spells']['4th Level'];
            var spell4String="<br><br>";
            for(var i=0;i<paladinLvl4Spells.length;i++){
                spell4String+="<button class=\"collapsible\">"+paladinLvl4Spells[i]+"</button><div class=\"content\">";
                spell4String+=allSpells[paladinLvl4Spells[i]]['content'].join("<br>")+"</div><br><br>";
            }
            document.getElementsByClassName("mainContent")[4].innerHTML=spell4String;
        }
        
        if(level>=17){
            var paladinLvl5Spells = spellJSON['Spellcasting']['Spell Lists']['Paladin Spells']['5th Level'];
            var spell5String="<br><br>";
            for(var i=0;i<paladinLvl5Spells.length;i++){
                spell5String+="<button class=\"collapsible\">"+paladinLvl5Spells[i]+"</button><div class=\"content\">";
                spell5String+=allSpells[paladinLvl5Spells[i]]['content'].join("<br>")+"</div><br><br>";
            }
            document.getElementsByClassName("mainContent")[5].innerHTML=spell5String;
        }
        
        
        
        
        //spellsElement.innerHTML=spellString;
        

        
    }
    else if(charClass=="ranger"){
        
        
        /*basic features for classes include hit points, proficiencies, and equipment*/
        basicFeaturesString+="<br><br>Hit Points: <br>" + classJSON['Ranger']['Class Features']['Hit Points']['content'][0] + "<br>";
        basicFeaturesString+=classJSON['Ranger']['Class Features']['Hit Points']['content'][1] + "<br>";
        basicFeaturesString+=classJSON['Ranger']['Class Features']['Hit Points']['content'][2] + "<br><br>";
        basicFeaturesString+="Proficiences:<br>";
        basicFeaturesString+=classJSON['Ranger']['Class Features']['Proficiencies']['content'][0]+"<br>";
        basicFeaturesString+=classJSON['Ranger']['Class Features']['Proficiencies']['content'][1]+"<br>";
        basicFeaturesString+=classJSON['Ranger']['Class Features']['Proficiencies']['content'][2]+"<br>";
        basicFeaturesString+=classJSON['Ranger']['Class Features']['Proficiencies']['content'][3]+"<br>";
        basicFeaturesString+=classJSON['Ranger']['Class Features']['Proficiencies']['content'][4]+"<br><br>";
        basicFeaturesString+="Equipment:<br>";
        basicFeaturesString+=classJSON['Ranger']['Class Features']['Equipment']['content'][0]+"<br>";
        basicFeaturesString+="- " + classJSON['Ranger']['Class Features']['Equipment']['content'][1][0]+"<br>";
        basicFeaturesString+="- " + classJSON['Ranger']['Class Features']['Equipment']['content'][1][1]+"<br>";
        basicFeaturesString+="- " + classJSON['Ranger']['Class Features']['Equipment']['content'][1][2]+"<br>";

        basicFeatures.innerHTML=basicFeaturesString;
        
        lvl1Features+="<b>Favored Enemy:</b><br>";
        lvl1Features+=classJSON['Ranger']['Class Features']['Favored Enemy']['content'].join(" ")+"<br><br>";
        lvl1Features+="<b>Natural Explorer:</b><br>";
        lvl1Features+=classJSON['Ranger']['Class Features']['Natural Explorer']['content'][0]+" ";
        lvl1Features+=classJSON['Ranger']['Class Features']['Natural Explorer']['content'][1]+"<br><br>";
        lvl1Features+=classJSON['Ranger']['Class Features']['Natural Explorer']['content'][2].join("<br>")+"<br><br>";
        lvl1Features+=classJSON['Ranger']['Class Features']['Natural Explorer']['content'][3];
        
        lvl1Element.innerHTML=lvl1Features;
        
        /*core ranger class - SRD, not the Revised Ranger UA*/
        
        if(level>=2){
            lvl2Features+="<b>Fighting Style:</b><br>";
            lvl2Features+=classJSON['Ranger']['Class Features']['Fighting Style']['content']+"<br>";
            lvl2Features+="<b>Archery:</b><br>";
            lvl2Features+=classJSON['Ranger']['Class Features']['Fighting Style']['Archery']+"<br>";
            lvl2Features+="<b>Defense:</b><br>";
            lvl2Features+=classJSON['Ranger']['Class Features']['Fighting Style']['Defense']+"<br>";
            lvl2Features+="<b>Dueling:</b><br>";
            lvl2Features+=classJSON['Ranger']['Class Features']['Fighting Style']['Dueling']+"<br>";
            lvl2Features+="<b>Two-Weapon Fighting:</b><br>";
            lvl2Features+=classJSON['Ranger']['Class Features']['Fighting Style']['Two-Weapon Fighting']+"<br><br>";
            lvl2Features+="<b>Spellcasting:</b><br>";
            lvl2Features+=classJSON['Ranger']['Class Features']['Spellcasting']['content']+"<br><br>";
            lvl2Features+="<b>Spells Known of 1st Level and Higher:</b><br>";
            lvl2Features+=classJSON['Ranger']['Class Features']['Spellcasting']['Spells Known of 1st Level and Higher']['content'].join(" ");
            lvl2Features+="<b>Spellcasting Ability:</b><br>";
            lvl2Features+=classJSON['Ranger']['Class Features']['Spellcasting']['Spellcasting Ability']['content'].join("<br>");

            lvl2Element.innerHTML=lvl2Features;
            
        }
        
        if(level>=3){
            lvl3Features+="<b>Ranger Archetype:</b><br>";
            lvl3Features+=classJSON['Ranger']['Class Features']['Ranger Archetype']+"<br><br>";
            lvl3Features+="<b>Primeval Awareness:</b><br>";
            lvl3Features+=classJSON['Ranger']['Class Features']['Primeval Awareness']+"<br><br>";
            lvl3Features+="<b>Ranger Archetypes:</b><br>";
            lvl3Features+=classJSON['Ranger']['Ranger Archetypes']['content']+"<br><br>";
            lvl3Features+="<b>Hunter:</b><br>";
            lvl3Features+=classJSON['Ranger']['Ranger Archetypes']['Hunter']['content']+"<br><br>";
            lvl3Features+="<b>Hunter's Prey:</b><br>";
            lvl3Features+=classJSON['Ranger']['Ranger Archetypes']['Hunter']['Hunters Prey']['content'].join("<br>");
            
            lvl3Element.innerHTML=lvl3Features;
        }
        
        if(level>=4){
            lvl4Features+="<b>Ability Score Improvement:</b><br>"
            lvl4Features+=classJSON['Ranger']['Class Features']['Ability Score Improvement'];
            
            lvl4Element.innerHTML=lvl4Features;
        }
        
        if(level>=5){
            lvl5Features+="<b>Extra Attack:</b><br>";
            lvl5Features+=classJSON['Ranger']['Class Features']['Extra Attack'];
            
            lvl5Element.innerHTML=lvl5Features;
            
        }
        
        /*level 6 is improvements on previously defined features.*/
        if(level>=7){
            lvl7Features+="<b>Defensive Tactics:</b><br>";
            lvl7Features+=classJSON['Ranger']['Ranger Archetypes']['Hunter']['Defensive Tactics']['content'].join("<br>");
            lvl7Element.innerHTML=lvl7Features;
        }
        
        if(level>=8){
            lvl8Features+="<b>Land's Stride:</b><br>";
            lvl8Features+=classJSON['Ranger']['Class Features']['Lands Stride']['content'].join(" ");
            
            lvl8Element.innerHTML=lvl8Features;
        }
        
        /*9 is spells*/
        
        if(level>=10){
            lvl10Features+="<b></b><br>";
            lvl10Features+=classJSON['Ranger']['Class Features']['Hide in Plain Sight']['content'].join(" ");
            
            lvl10Element.innerHTML=lvl10Features;
        }
        
        if(level>=11){
            lvl11Features+="<b></b><br>";
            lvl11Features+=classJSON['Ranger']['Ranger Archetypes']['Hunter']['Multiattack']['content'].join("<br>");
            
            lvl11Element.innerHTML=lvl11Features;
        }
        
        /*12 is ASI, 13 is spells*/
        if(level>=14){
            lvl14Features+="<b>Vanish:</b><br>";
            lvl14Features+=classJSON['Ranger']['Class Features']['Vanish'];
            
            lvl14Element.innerHTML=lvl14Features;
        }
        
        if(level>=15){
            lvl15Features+="<b>Superior Hunter's Defense:</b><br>";
            lvl15Features+=classJSON['Ranger']['Ranger Archetypes']['Hunter']['Superior Hunters Defense']['content'];
        }
        
        /*16 is ASI, 17 is spells*/
        
        if(level>=18){
            lvl18Features+="<b>Feral Senses:</b><br>";
            lvl18Features+=classJSON['Ranger']['Class Features']['Feral Senses']['content'];
            
            lvl18Element.innerHTML=lvl18Features;
        }
        
        /*19 is ASI*/
        
        if(level==20){
            lvl20Features+="<b>Foe Slayer:</b><br>";
            lvl20Features+=classJSON['Ranger']['Class Features']['Foe Slayer'];
            
            lvl20Element.innerHTML=lvl20Features;
        }
        
        
        
        var rangerLvl1Spells = spellJSON['Spellcasting']['Spell Lists']['Ranger Spells']['1st Level'];
        var allSpells = spellJSON['Spellcasting']['Spell Descriptions'];
        
        
        //var spellsElement = document.getElementById("final spells");
        ;
        if(level>=2){
            var spell1String="<br><br>";
            for(var i=0;i<rangerLvl1Spells.length;i++){
                spell1String+="<button class=\"collapsible\">"+rangerLvl1Spells[i]+"</button><div class=\"content\">";
                spell1String+=allSpells[rangerLvl1Spells[i]]['content'].join("<br>")+"</div><br><br>";
            }
            document.getElementsByClassName("mainContent")[1].innerHTML=spell1String;
        }
        
        if(level>=5){
            var rangerLvl2Spells = spellJSON['Spellcasting']['Spell Lists']['Ranger Spells']['2nd Level'];
            var spell2String="<br><br>";
            for(var i=0;i<rangerLvl2Spells.length;i++){
                spell2String+="<button class=\"collapsible\">"+rangerLvl2Spells[i]+"</button><div class=\"content\">";
                spell2String+=allSpells[rangerLvl2Spells[i]]['content'].join("<br>")+"</div><br><br>";
            }
            document.getElementsByClassName("mainContent")[2].innerHTML=spell2String;
        }
        
        if(level>=9){
            var rangerLvl3Spells = spellJSON['Spellcasting']['Spell Lists']['Ranger Spells']['3rd Level'];
            var spell3String="<br><br>";
            for(var i=0;i<rangerLvl3Spells.length;i++){
                spell3String+="<button class=\"collapsible\">"+rangerLvl3Spells[i]+"</button><div class=\"content\">";
                spell3String+=allSpells[rangerLvl3Spells[i]]['content'].join("<br>")+"</div><br><br>";
            }
            document.getElementsByClassName("mainContent")[3].innerHTML=spell3String;
        }
        
        if(level>=13){
            var rangerLvl4Spells = spellJSON['Spellcasting']['Spell Lists']['Ranger Spells']['4th Level'];
            var spell4String="<br><br>";
            for(var i=0;i<rangerLvl4Spells.length;i++){
                spell4String+="<button class=\"collapsible\">"+rangerLvl4Spells[i]+"</button><div class=\"content\">";
                spell4String+=allSpells[rangerLvl4Spells[i]]['content'].join("<br>")+"</div><br><br>";
            }
            document.getElementsByClassName("mainContent")[4].innerHTML=spell4String;
        }
        
        if(level>=17){
            var rangerLvl5Spells = spellJSON['Spellcasting']['Spell Lists']['Ranger Spells']['5th Level'];
            var spell5String="<br><br>";
            for(var i=0;i<rangerLvl5Spells.length;i++){
                spell5String+="<button class=\"collapsible\">"+rangerLvl5Spells[i]+"</button><div class=\"content\">";
                spell5String+=allSpells[rangerLvl5Spells[i]]['content'].join("<br>")+"</div><br><br>";
            }
            document.getElementsByClassName("mainContent")[5].innerHTML=spell5String;
        }
        
        
        
        
        //spellsElement.innerHTML=spellString;
        
        
        
    }
    else if(charClass=="rogue"){
        
        /*basic features for classes include hit points, proficiencies, and equipment*/
        basicFeaturesString+="<br><br>Hit Points: <br>" + classJSON['Rogue']['Class Features']['Hit Points']['content'][0] + "<br>";
        basicFeaturesString+=classJSON['Rogue']['Class Features']['Hit Points']['content'][1] + "<br>";
        basicFeaturesString+=classJSON['Rogue']['Class Features']['Hit Points']['content'][2] + "<br><br>";
        basicFeaturesString+="Proficiences:<br>";
        basicFeaturesString+=classJSON['Rogue']['Class Features']['Proficiencies']['content'][0]+"<br>";
        basicFeaturesString+=classJSON['Rogue']['Class Features']['Proficiencies']['content'][1]+"<br>";
        basicFeaturesString+=classJSON['Rogue']['Class Features']['Proficiencies']['content'][2]+"<br>";
        basicFeaturesString+=classJSON['Rogue']['Class Features']['Proficiencies']['content'][3]+"<br>";
        basicFeaturesString+=classJSON['Rogue']['Class Features']['Proficiencies']['content'][4]+"<br><br>";
        basicFeaturesString+="Equipment:<br>";
        basicFeaturesString+=classJSON['Rogue']['Class Features']['Equipment']['content'][0]+"<br>";
        basicFeaturesString+="- " + classJSON['Rogue']['Class Features']['Equipment']['content'][1][0]+"<br>";
        basicFeaturesString+="- " + classJSON['Rogue']['Class Features']['Equipment']['content'][1][1]+"<br>";
        basicFeaturesString+="- " + classJSON['Rogue']['Class Features']['Equipment']['content'][1][2]+"<br>";

        basicFeatures.innerHTML=basicFeaturesString;
        
        
        lvl1Features+="<b>Expertise:</b><br>";
        lvl1Features+=classJSON['Rogue']['Class Features']['Expertise']['content'].join(" ")+"<br><br>";
        lvl1Features+="<b>Sneak Attack:</b><br>";
        lvl1Features+=classJSON['Rogue']['Class Features']['Sneak Attack']['content'].join(" ")+"<br><br>";
        lvl1Features+="<b>Thieves' Cant:</b><br>";
        lvl1Features+=classJSON['Rogue']['Class Features']['Thieves Cant']['content'].join(" ");
        
        lvl1Element.innerHTML=lvl1Features;
        
        if(level>=2){
            lvl2Features+="<b>Cunning Action:</b><br>";
            lvl2Features+=classJSON['Rogue']['Class Features']['Cunning Action'];
            
            lvl2Element.innerHTML=lvl2Features;
        }
        
        if(level>=3){
            lvl3Features+="<b>Roguish Archetype:</b><br>";
            lvl3Features+=classJSON['Rogue']['Class Features']['Roguish Archetype']+"<br><br>";
            lvl3Features+="<b>Roguish Archetypes:</b><br>";
            lvl3Features+=classJSON['Rogue']['Roguish Archetypes']['content']+"<br><br>";
            lvl3Features+="<b>Thief:</b><br>";
            lvl3Features+=classJSON['Rogue']['Roguish Archetypes']['Thief']['content']+"<br><br>";
            lvl3Features+="<b>Fast Hands:</b><br>";
            lvl3Features+=classJSON['Rogue']['Roguish Archetypes']['Thief']['Fast Hands']+"<br><br>";
            lvl3Features+="<b>Second-Story Work:</b><br>";
            lvl3Features+=classJSON['Rogue']['Roguish Archetypes']['Thief']['Second-Story Work']['content'].join(" ");
            
            lvl3Element.innerHTML=lvl3Features;
        }
        
        if(level>=4){
            lvl4Features+="<b>Ability Score Improvement:</b><br>";
            lvl4Features+=classJSON['Rogue']['Class Features']['Ability Score Improvement'];
            
            lvl4Element.innerHTML=lvl4Features;
        }
        
        if(level>=5){
            lvl5Features+="<b>Uncanny Dodge:</b><br>"
            lvl5Features+=classJSON['Rogue']['Class Features']['Uncanny Dodge'];
            
            lvl5Element.innerHTML=lvl5Features;
        }
        
        /*6 is more expertise*/
        
        if(level>=7){
            lvl7Features+="<b>Evasion:</b><br>";
            lvl7Features+=classJSON['Rogue']['Class Features']['Evasion'];
            
            lvl7Element.innerHTML=lvl7Features;
        }
        
        /*8 is ASI*/

        if(level>=9){
            lvl9Features+="<b>Supreme Sneak:</b><br>";
            lvl9Features+=classJSON['Rogue']['Roguish Archetypes']['Thief']['Supreme Sneak'];
            
            lvl9Element.innerHTML=lvl9Features;
        }
        
        /*10 is another ASI*/
        
        if(level>=11){
            lvl11Features+="<b>Reliable Talent:</b><br>";
            lvl11Features+=classJSON['Rogue']['Class Features']['Reliable Talent'];
            
            lvl11Element.innerHTML=lvl11Features;
        }
        
        /*12 is ASI*/
        
        if(level>=13){
            lvl13Features+="<b>Use Magic Device:</b><br>";
            lvl13Features+=classJSON['Rogue']['Roguish Archetypes']['Thief']['Use Magic Device'];
            
            lvl13Element.innerHTML=lvl13Features;
        }
        
        if(level>=14){
            lvl14Features+="<b>Blindsense:</b><br>";
            lvl14Features+=classJSON['Rogue']['Class Features']['Blindsense'];
            
            lvl14Element.innerHTML=lvl14Features;
        }
        
        if(level>=15){
            lvl15Features+="<b>Slippery Mind:</b><br>";
            lvl15Features+=classJSON['Rogue']['Class Features']['Slippery Mind']+"<br><br>";
            
            lvl15Element.innerHTML=lvl15Features;
        }
        
        /*16 is ASI*/
        
        if(level>=17){
            lvl17Features+="<b>Thief's Reflexes:</b><br>";
            lvl17Features+=classJSON['Rogue']['Roguish Archetypes']['Thief']['Thiefs Reflexes']+"<br><br>";
            
            lvl17Element.innerHTML=lvl17Features;
        }
        
        if(level>=18){
            lvl18Features+="<b>Elusive:</b><br>";
            lvl18Features+=classJSON['Rogue']['Class Features']['Elusive'];
            
            lvl18Element.innerHTML=lvl18Features;
        }
        
        /*19 is ASI*/
        
        if(level==20){
            lvl20Features+="<b>Stroke of Luck:</b><br>";
            lvl20Features+=classJSON['Rogue']['Class Features']['Stroke of Luck']['content'].join(" ");
            
            lvl20Element.innerHTML=lvl20Features;
        }
        
        
    }
    else if(charClass=="sorcerer"){
        
        
        /*basic features for classes include hit points, proficiencies, and equipment*/
        basicFeaturesString+="<br><br>Hit Points: <br>" + classJSON['Sorcerer']['Class Features']['Hit Points']['content'][0] + "<br>";
        basicFeaturesString+=classJSON['Sorcerer']['Class Features']['Hit Points']['content'][1] + "<br>";
        basicFeaturesString+=classJSON['Sorcerer']['Class Features']['Hit Points']['content'][2] + "<br><br>";
        basicFeaturesString+="Proficiences:<br>";
        basicFeaturesString+=classJSON['Sorcerer']['Class Features']['Proficiencies']['content'][0]+"<br>";
        basicFeaturesString+=classJSON['Sorcerer']['Class Features']['Proficiencies']['content'][1]+"<br>";
        basicFeaturesString+=classJSON['Sorcerer']['Class Features']['Proficiencies']['content'][2]+"<br>";
        basicFeaturesString+=classJSON['Sorcerer']['Class Features']['Proficiencies']['content'][3]+"<br>";
        basicFeaturesString+=classJSON['Sorcerer']['Class Features']['Proficiencies']['content'][4]+" ";
        basicFeaturesString+=classJSON['Sorcerer']['Class Features']['Proficiencies']['content'][5]+"<br><br>";
        basicFeaturesString+="Equipment:<br>";
        basicFeaturesString+=classJSON['Sorcerer']['Class Features']['Equipment']['content'][0]+"<br>";
        basicFeaturesString+="- " + classJSON['Sorcerer']['Class Features']['Equipment']['content'][1][0]+"<br>";
        basicFeaturesString+="- " + classJSON['Sorcerer']['Class Features']['Equipment']['content'][1][1]+"<br>";
        basicFeaturesString+="- " + classJSON['Sorcerer']['Class Features']['Equipment']['content'][1][2]+"<br>";

        basicFeatures.innerHTML=basicFeaturesString;
        
        lvl1Features+="<b>Spellcasting:</b><br>";
        lvl1Features+=classJSON['Sorcerer']['Class Features']['Spellcasting']['content']+"<br><br>";
        lvl1Features+="<b>Cantrips:</b><br>";
        lvl1Features+=classJSON['Sorcerer']['Class Features']['Spellcasting']['Cantrips']+"<br><br>";
        lvl1Features+="<b>Spell Slots:</b><br>";
        lvl1Features+=classJSON['Sorcerer']['Class Features']['Spellcasting']['Spell Slots']['content'].join(" ")+"<br><br>";
        lvl1Features+="<b>Spells Known of 1st Level and Higher:</b><br>";
        lvl1Features+=classJSON['Sorcerer']['Class Features']['Spellcasting']['Spells Known of 1st Level and Higher']['content'].join(" ")+"<br><br>";
        lvl1Features+="<b>Spellcasting Ability:</b><br>";
        lvl1Features+=classJSON['Sorcerer']['Class Features']['Spellcasting']['Spellcasting Ability']['content'].join("<br>")+"<br><br>";
        lvl1Features+="<b>Spellcasting Focus:</b><br>";
        lvl1Features+=classJSON['Sorcerer']['Class Features']['Spellcasting']['Spellcasting Focus']+"<br><br>";
        lvl1Features+="<b>Sorcerous Origin:</b><br>";
        lvl1Features+=classJSON['Sorcerer']['Class Features']['Sorcerous Origin']['content']+"<br><br>";
        
        /*sorcerer sub class*/
        lvl1Features+="<b>Sorcererous Origins:</b><br>";
        lvl1Features+=classJSON['Sorcerer']['Sorcerous Origins']['content']+"<br><br>";
        lvl1Features+="<b>Draconic Bloodline:</b><br>";
        lvl1Features+=classJSON['Sorcerer']['Sorcerous Origins']['Draconic Bloodline']['content']+"<br><br>";
        lvl1Features+="<b>Dragon Ancestor:</b><br>";
        lvl1Features+=classJSON['Sorcerer']['Sorcerous Origins']['Draconic Bloodline']['Dragon Ancestor']['content']+"<br><br>";
        lvl1Features+="<b>Dragon:</b><br>";
        lvl1Features+=classJSON['Sorcerer']['Sorcerous Origins']['Draconic Bloodline']['Dragon Ancestor']['Draconic Ancestry']['content'][0]['table']['Dragon'].join(" ")+"<br>";
        lvl1Features+="<b>Damage Type:</b><br>";
        lvl1Features+=classJSON['Sorcerer']['Sorcerous Origins']['Draconic Bloodline']['Dragon Ancestor']['Draconic Ancestry']['content'][0]['table']['Damage Type'].join(" ")+"<br><br>";
        lvl1Features+="<b>Draconic Ancestry:</b><br>";
        lvl1Features+=classJSON['Sorcerer']['Sorcerous Origins']['Draconic Bloodline']['Dragon Ancestor']['Draconic Ancestry']['content'][1]+"<br><br>";
        lvl1Features+="<b>Draconic Resilience:</b><br>";
        lvl1Features+=classJSON['Sorcerer']['Sorcerous Origins']['Draconic Bloodline']['Draconic Resilience']['content'].join(" ");
        
        lvl1Element.innerHTML=lvl1Features;
        
        
        
        if(level>=2){
            lvl2Features+="<b>Font of Magic:</b><br>";
            lvl2Features+=classJSON['Sorcerer']['Class Features']['Font of Magic']['content']+"<br><br>";
            lvl2Features+="<b>Sorcery Points:</b><br>";
            lvl2Features+=classJSON['Sorcerer']['Class Features']['Font of Magic']['Sorcery Points']+"<br><br>";
            lvl2Features+="<b>Flexible Casting:</b><br>";
            lvl2Features+=classJSON['Sorcerer']['Class Features']['Font of Magic']['Flexible Casting']['content'].join(" ")+"<br><br>";
            lvl2Features+="<b>Spell Slot Level:</b><br>";
            lvl2Features+=classJSON['Sorcerer']['Class Features']['Font of Magic']['Flexible Casting']['Creating Spell Slots']['content'][0]['table']['Spell Slot Level'].join(" ")+"<br>";
            lvl2Features+="<b>Sorcery Point Cost:</b><br>";
            lvl2Features+=classJSON['Sorcerer']['Class Features']['Font of Magic']['Flexible Casting']['Creating Spell Slots']['content'][0]['table']['Sorcery Point Cost'].join(" ");
            
            lvl2Element.innerHTML=lvl2Features;
        }
        
        if(level>=3){
            lvl3Features+="<b>Metamagic:</b><br>";
            lvl3Features+=classJSON['Sorcerer']['Class Features']['Metamagic']['content'].join(" ")+"<br><br>";
            lvl3Features+="<b>Careful Spell:</b><br>";
            lvl3Features+=classJSON['Sorcerer']['Class Features']['Metamagic']['Careful Spell']+"<br>";
            lvl3Features+="<b>Distant Spell:</b><br>";
            lvl3Features+=classJSON['Sorcerer']['Class Features']['Metamagic']['Distant Spell']['content'].join(" ")+"<br>";
            lvl3Features+="<b>Empowered Spell:</b><br>";
            lvl3Features+=classJSON['Sorcerer']['Class Features']['Metamagic']['Empowered Spell']['content'].join(" ")+"<br>";
            lvl3Features+="<b>Extended Spell:</b><br>";
            lvl3Features+=classJSON['Sorcerer']['Class Features']['Metamagic']['Extended Spell']+"<br>";
            lvl3Features+="<b>Heightened Spell:</b><br>";
            lvl3Features+=classJSON['Sorcerer']['Class Features']['Metamagic']['Heightened Spell']+"<br>";
            lvl3Features+="<b>Quickened Spell:</b><br>";
            lvl3Features+=classJSON['Sorcerer']['Class Features']['Metamagic']['Quickened Spell']+"<br>";
            lvl3Features+="<b>Subtle Spell:</b><br>";
            lvl3Features+=classJSON['Sorcerer']['Class Features']['Metamagic']['Subtle Spell']+"<br>";
            lvl3Features+="<b>Twinned Spell:</b><br>";
            lvl3Features+=classJSON['Sorcerer']['Class Features']['Metamagic']['Twinned Spell']['content'].join(" ");

            lvl3Element.innerHTML=lvl3Features;
            
        }
        
        if(level>=4){
            lvl4Features+="<b>Ability Score Improvement:</b><br>";
            lvl4Features+=classJSON['Sorcerer']['Class Features']['Ability Score Improvement'];
            
            lvl4Element.innerHTML=lvl4Features;
        }
        
        /*all not noted levels are improvements, spells, or ASIs*/
        
        if(level>=6){
            lvl6Features+="<b>Elemental Affinity:</b><br>";
            lvl6Features+=classJSON['Sorcerer']['Sorcerous Origins']['Draconic Bloodline']['Elemental Affinity'];
            
            lvl6Element.innerHTML=lvl6Features;
        }
        
        if(level>=14){
            lvl14Features+="<b>Dragon Wings:</b><br>";
            lvl14Features+=classJSON['Sorcerer']['Sorcerous Origins']['Draconic Bloodline']['Dragon Wings']['content']; 
            
            lvl14Element.innerHTML=lvl14Features;
        }
        
        if(level>=18){
            lvl18Features+="<b>Dracoinc Presence:</b><br>";
            lvl18Features+=classJSON['Sorcerer']['Sorcerous Origins']['Draconic Bloodline']['Draconic Presence'];
            
            lvl18Element.innerHTML=lvl18Features;
        }
        
        if(level==20){
            lvl20Features+="<b>Sorcerous Restoration:</b><br>";
            lvl20Features+=classJSON['Sorcerer']['Class Features']['Sorcerous Restoration'];
            
            lvl20Element.innerHTML=lvl20Features;
        }
        
        
        
        
        var sorcererCantrips = spellJSON['Spellcasting']['Spell Lists']['Sorcerer Spells']['Cantrips (0 Level)'];
        var sorcererLvl1Spells = spellJSON['Spellcasting']['Spell Lists']['Sorcerer Spells']['1st Level'];
        var allSpells = spellJSON['Spellcasting']['Spell Descriptions'];
        
        
        //var spellsElement = document.getElementById("final spells");
        var spell1String="<br><br>";
        var cantripString="<br><br>";
        for(var i=0;i<sorcererCantrips.length;i++){
            cantripString+="<button class=\"collapsible\">"+sorcererCantrips[i]+"</button><div class=\"content\">";
            cantripString+=allSpells[sorcererCantrips[i]]['content'].join("<br>")+"</div><br><br>";
        }
        for(var i=0;i<sorcererLvl1Spells.length;i++){
            spell1String+="<button class=\"collapsible\">"+sorcererLvl1Spells[i]+"</button><div class=\"content\">";
            spell1String+=allSpells[sorcererLvl1Spells[i]]['content'].join("<br>")+"</div><br><br>";
        }
        
        document.getElementsByClassName("mainContent")[0].innerHTML=cantripString;
        document.getElementsByClassName("mainContent")[1].innerHTML=spell1String;
        
        if(level>=3){
            var sorcererLvl2Spells = spellJSON['Spellcasting']['Spell Lists']['Sorcerer Spells']['2nd Level'];
            var spell2String="<br><br>";
            for(var i=0;i<sorcererLvl2Spells.length;i++){
                spell2String+="<button class=\"collapsible\">"+sorcererLvl2Spells[i]+"</button><div class=\"content\">";
                spell2String+=allSpells[sorcererLvl2Spells[i]]['content'].join("<br>")+"</div><br><br>";
            }
            document.getElementsByClassName("mainContent")[2].innerHTML=spell2String;
        }
        
        if(level>=5){
            var sorcererLvl3Spells = spellJSON['Spellcasting']['Spell Lists']['Sorcerer Spells']['3rd Level'];
            var spell3String="<br><br>";
            for(var i=0;i<sorcererLvl3Spells.length;i++){
                spell3String+="<button class=\"collapsible\">"+sorcererLvl3Spells[i]+"</button><div class=\"content\">";
                spell3String+=allSpells[sorcererLvl3Spells[i]]['content'].join("<br>")+"</div><br><br>";
            }
            document.getElementsByClassName("mainContent")[3].innerHTML=spell3String;
        }
        
        if(level>=7){
            var sorcererLvl4Spells = spellJSON['Spellcasting']['Spell Lists']['Sorcerer Spells']['4th Level'];
            var spell4String="<br><br>";
            for(var i=0;i<sorcererLvl4Spells.length;i++){
                spell4String+="<button class=\"collapsible\">"+sorcererLvl4Spells[i]+"</button><div class=\"content\">";
                spell4String+=allSpells[sorcererLvl4Spells[i]]['content'].join("<br>")+"</div><br><br>";
            }
            document.getElementsByClassName("mainContent")[4].innerHTML=spell4String;
        }
        
        if(level>=9){
            var sorcererLvl5Spells = spellJSON['Spellcasting']['Spell Lists']['Sorcerer Spells']['5th Level'];
            var spell5String="<br><br>";
            for(var i=0;i<sorcererLvl5Spells.length;i++){
                spell5String+="<button class=\"collapsible\">"+sorcererLvl5Spells[i]+"</button><div class=\"content\">";
                spell5String+=allSpells[sorcererLvl5Spells[i]]['content'].join("<br>")+"</div><br><br>";
            }
            document.getElementsByClassName("mainContent")[5].innerHTML=spell5String;
        }
        
        if(level>=11){
            var spell6String="<br><br>";
            var sorcererLvl6Spells = spellJSON['Spellcasting']['Spell Lists']['Sorcerer Spells']['6th Level'];
            for(var i=0;i<sorcererLvl6Spells.length;i++){
                spell6String+="<button class=\"collapsible\">"+sorcererLvl6Spells[i]+"</button><div class=\"content\">";
                spell6String+=allSpells[sorcererLvl6Spells[i]]['content'].join("<br>")+"</div><br><br>";
            }
            document.getElementsByClassName("mainContent")[6].innerHTML=spell6String;
        }
        
        if(level>=13){
            var sorcererLvl7Spells = spellJSON['Spellcasting']['Spell Lists']['Sorcerer Spells']['7th Level'];
            var spell7String="<br><br>";
            for(var i=0;i<sorcererLvl7Spells.length;i++){
                spell7String+="<button class=\"collapsible\">"+sorcererLvl7Spells[i]+"</button><div class=\"content\">";
                spell7String+=allSpells[sorcererLvl7Spells[i]]['content'].join("<br>")+"</div><br><br>";
            }
            document.getElementsByClassName("mainContent")[7].innerHTML=spell7String;
        }
        
        if(level>=15){
            var sorcererLvl8Spells = spellJSON['Spellcasting']['Spell Lists']['Sorcerer Spells']['8th Level'];
            var spell8String="<br><br>";
            for(var i=0;i<sorcererLvl8Spells.length;i++){
                spell8String+="<button class=\"collapsible\">"+sorcererLvl8Spells[i]+"</button><div class=\"content\">";
                spell8String+=allSpells[sorcererLvl8Spells[i]]['content'].join("<br>")+"</div><br><br>";
            }
            document.getElementsByClassName("mainContent")[8].innerHTML=spell8String;
        }
        
        if(level>=17){
            var sorcererLvl9Spells = spellJSON['Spellcasting']['Spell Lists']['Sorcerer Spells']['9th Level'];
            var spell9String="<br><br>";
            for(var i=0;i<sorcererLvl9Spells.length;i++){
                spell9String+="<button class=\"collapsible\">"+sorcererLvl9Spells[i]+"</button><div class=\"content\">";
                spell9String+=allSpells[sorcererLvl9Spells[i]]['content'].join("<br>")+"</div><br><br>";
            }
            document.getElementsByClassName("mainContent")[9].innerHTML=spell9String;
        }
        
        
        //spellsElement.innerHTML=spellString;
        
        
        
        
        
        
    }
    else if(charClass=="warlock"){
        
        
        /*basic features for classes include hit points, proficiencies, and equipment*/
        basicFeaturesString+="<br><br>Hit Points: <br>" + classJSON['Warlock']['Class Features']['Hit Points']['content'][0] + "<br>";
        basicFeaturesString+=classJSON['Warlock']['Class Features']['Hit Points']['content'][1] + "<br>";
        basicFeaturesString+=classJSON['Warlock']['Class Features']['Hit Points']['content'][2] + "<br><br>";
        basicFeaturesString+="Proficiences:<br>";
        basicFeaturesString+=classJSON['Warlock']['Class Features']['Proficiencies']['content'][0]+"<br>";
        basicFeaturesString+=classJSON['Warlock']['Class Features']['Proficiencies']['content'][1]+"<br>";
        basicFeaturesString+=classJSON['Warlock']['Class Features']['Proficiencies']['content'][2]+"<br>";
        basicFeaturesString+=classJSON['Warlock']['Class Features']['Proficiencies']['content'][3]+"<br>";
        basicFeaturesString+=classJSON['Warlock']['Class Features']['Proficiencies']['content'][4]+"<br><br>";
        basicFeaturesString+="Equipment:<br>";
        basicFeaturesString+=classJSON['Warlock']['Class Features']['Equipment']['content'][0]+"<br>";
        basicFeaturesString+="- " + classJSON['Warlock']['Class Features']['Equipment']['content'][1][0]+"<br>";
        basicFeaturesString+="- " + classJSON['Warlock']['Class Features']['Equipment']['content'][1][1]+"<br>";
        basicFeaturesString+="- " + classJSON['Warlock']['Class Features']['Equipment']['content'][1][2]+"<br>";

        basicFeatures.innerHTML=basicFeaturesString;
        
        
        lvl1Features+="<b>Pact Magic:</b><br>";
        lvl1Features+=classJSON['Warlock']['Class Features']['Pact Magic']['content']+"<br><br>";
        lvl1Features+="<b>Cantrips:</b><br>";
        lvl1Features+=classJSON['Warlock']['Class Features']['Pact Magic']['Cantrips']+"<br><br>";
        lvl1Features+="<b>Spell Slots:</b><br>";
        lvl1Features+=classJSON['Warlock']['Class Features']['Pact Magic']['Spell Slots']['content'].join(" ")+"<br><br>";
        lvl1Features+="<b>Spells Known of 1st Level and Higher:</b><br>";
        lvl1Features+=classJSON['Warlock']['Class Features']['Pact Magic']['Spells Known of 1st Level and Higher']['content']+"<br><br>";
        lvl1Features+="<b>Spellcasting Ability:</b><br>";
        lvl1Features+=classJSON['Warlock']['Class Features']['Pact Magic']['Spellcasting Ability']['content'].join("<br>")+"<br><br>";
        lvl1Features+="<b>Spellcasting Focus:</b><br>";
        lvl1Features+=classJSON['Warlock']['Class Features']['Pact Magic']['Spellcasting Focus']+"<br><br>";
        lvl1Features+="<b>Otherworldly Patron:</b><br>";
        lvl1Features+=classJSON['Warlock']['Class Features']['Otherworldly Patron']+"<br><br>";
        
        /*patron*/
        lvl1Features+="<b>Otherworldly Patrons:</b><br>";
        lvl1Features+=classJSON['Warlock']['Otherworldly Patrons']['content'].join(" ")+"<br><br>";
        lvl1Features+="<b>The Fiend:</b><br>";
        lvl1Features+=classJSON['Warlock']['Otherworldly Patrons']['The Fiend']['content']+"<br><br>";
        lvl1Features+="<b>Expanded Spell List:</b><br>";
        lvl1Features+=classJSON['Warlock']['Otherworldly Patrons']['The Fiend']['Expanded Spell List']['content']+"<br><br>";
        
        /*fiend spell list*/
        lvl1Features+="<table>"+
        "<tr>"+
        "<th>Spell Level</th><th>Spells</th>"+    
        "</tr>"+
        "<tr>"+
        "<td>"+ classJSON['Warlock']['Otherworldly Patrons']['The Fiend']['Expanded Spell List']['Fiend Expanded Spells']['table']['Spell Level'][0] +"</td>"+
        "<td>"+ classJSON['Warlock']['Otherworldly Patrons']['The Fiend']['Expanded Spell List']['Fiend Expanded Spells']['table']['Spells'][0] +"</td>"+
        "</tr>"+
        "<tr>"+
        "<td>"+ classJSON['Warlock']['Otherworldly Patrons']['The Fiend']['Expanded Spell List']['Fiend Expanded Spells']['table']['Spell Level'][1] +"</td>"+
        "<td>"+ classJSON['Warlock']['Otherworldly Patrons']['The Fiend']['Expanded Spell List']['Fiend Expanded Spells']['table']['Spells'][1] +"</td>"+
        "</tr>"+
        "<tr>"+
        "<td>"+ classJSON['Warlock']['Otherworldly Patrons']['The Fiend']['Expanded Spell List']['Fiend Expanded Spells']['table']['Spell Level'][2] +"</td>"+
        "<td>"+ classJSON['Warlock']['Otherworldly Patrons']['The Fiend']['Expanded Spell List']['Fiend Expanded Spells']['table']['Spells'][2] +"</td>"+
        "</tr>"+
        "<tr>"+
        "<td>"+ classJSON['Warlock']['Otherworldly Patrons']['The Fiend']['Expanded Spell List']['Fiend Expanded Spells']['table']['Spell Level'][3] +"</td>"+
        "<td>"+ classJSON['Warlock']['Otherworldly Patrons']['The Fiend']['Expanded Spell List']['Fiend Expanded Spells']['table']['Spells'][3] +"</td>"+
        "</tr>"+
        "<tr>"+
        "<td>"+ classJSON['Warlock']['Otherworldly Patrons']['The Fiend']['Expanded Spell List']['Fiend Expanded Spells']['table']['Spell Level'][4] +"</td>"+
        "<td>"+ classJSON['Warlock']['Otherworldly Patrons']['The Fiend']['Expanded Spell List']['Fiend Expanded Spells']['table']['Spells'][4] +"</td>"+
        "</tr>"+
        "</table><br><br>";
        
        
        
        lvl1Features+="<b>Dark One's Blessing:</b><br>";
        lvl1Features+=classJSON['Warlock']['Otherworldly Patrons']['The Fiend']['Dark Ones Blessing'];
        
        
        
        lvl1Element.innerHTML=lvl1Features;
        
        
        if(level>=2){
            lvl2Features+="<b>Eldritch Invocations:</b><br>";
            lvl2Features+=classJSON['Warlock']['Class Features']['Eldritch Invocations']['content'].join(" ")+"<br><br>";
            
            
            lvl2Features+="<b>Agonizing Blast:</b><br>";
            lvl2Features+=classJSON['Warlock']['Eldritch Invocations']['Agonizing Blast']['content'].join("<br>")+"<br><br>";
            lvl2Features+="<b>Armor of Shadows:</b><br>";
            lvl2Features+=classJSON['Warlock']['Eldritch Invocations']['Armor of Shadows']+"<br><br>";
            lvl2Features+="<b>Beast Speech:</b><br>";
            lvl2Features+=classJSON['Warlock']['Eldritch Invocations']['Beast Speech']+"<br><br>";
            lvl2Features+="<b>Beguiling Influence:</b><br>";
            lvl2Features+=classJSON['Warlock']['Eldritch Invocations']['Beguiling Influence']+"<br><br>";
            lvl2Features+="<b>Book of Ancient Secrets:</b><br>";
            lvl2Features+=classJSON['Warlock']['Eldritch Invocations']['Book of Ancient Secrets']['content'].join("<br>")+"<br><br>";
            lvl2Features+="<b>Devil's Sight:</b><br>";
            lvl2Features+=classJSON['Warlock']['Eldritch Invocations']['Devils Sight']+"<br><br>";
            lvl2Features+="<b>Eldritch Sight:</b><br>";
            lvl2Features+=classJSON['Warlock']['Eldritch Invocations']['Eldritch Sight']+"<br><br>";
            lvl2Features+="<b>Eldritch Spear:</b><br>";
            lvl2Features+=classJSON['Warlock']['Eldritch Invocations']['Eldritch Spear']['content'].join("<br>")+"<br><br>";
            lvl2Features+="<b>Eyes of the Rune Keeper:</b><br>";
            lvl2Features+=classJSON['Warlock']['Eldritch Invocations']['Eyes of the Rune Keeper']+"<br><br>";
            lvl2Features+="<b>Fiendish Vigor:</b><br>";
            lvl2Features+=classJSON['Warlock']['Eldritch Invocations']['Fiendish Vigor']+"<br><br>";
            lvl2Features+="<b>Gaze of Two Minds:</b><br>";
            lvl2Features+=classJSON['Warlock']['Eldritch Invocations']['Gaze of Two Minds']+"<br><br>";
            lvl2Features+="<b>Mask of Many Faces:</b><br>";
            lvl2Features+=classJSON['Warlock']['Eldritch Invocations']['Mask of Many Faces']+"<br><br>";
            lvl2Features+="<b>Misty Visions:</b><br>";
            lvl2Features+=classJSON['Warlock']['Eldritch Invocations']['Misty Visions']+"<br><br>";
            lvl2Features+="<b>Repelling Blast:</b><br>";
            lvl2Features+=classJSON['Warlock']['Eldritch Invocations']['Repelling Blast']['content'].join("<br>")+"<br><br>";
            lvl2Features+="<b>Thief of Five Fates:</b><br>";
            lvl2Features+=classJSON['Warlock']['Eldritch Invocations']['Thief of Five Fates']+"<br><br>";
            lvl2Features+="<b>Voice of the Chain Master:</b><br>";
            lvl2Features+=classJSON['Warlock']['Eldritch Invocations']['Voice of the Chain Master']['content']+"<br><br>";
            
            

            
            
            lvl2Element.innerHTML=lvl2Features;
        }
        
        if(level>=3){
            lvl3Features+="<b>Pact Boon:</b><br>";
            lvl3Features+=classJSON['Warlock']['Class Features']['Pact Boon']['content']+"<br><br>";
            lvl3Features+="<b>Pact of the Chain:</b><br>";
            lvl3Features+=classJSON['Warlock']['Class Features']['Pact Boon']['Pact of the Chain']['content'].join(" ")+"<br><br>";
            lvl3Features+="<b>Pact of the Blade:</b><br>";
            lvl3Features+=classJSON['Warlock']['Class Features']['Pact Boon']['Pact of the Blade']['content'].join(" ")+"<br><br>";
            lvl3Features+="<b>Pact of the Tome:</b><br>";
            lvl3Features+=classJSON['Warlock']['Class Features']['Pact Boon']['Pact of the Tome']['content'].join(" ")+"<br><br>";
            
            /*extra stuff on pacts*/
            lvl3Features+="<b>Your Pact Boon:</b><br>";
            lvl3Features+=classJSON['Warlock']['Otherworldly Patrons']['Your Pact Boon']['content'].join("<br><br>");
            
            lvl3Element.innerHTML=lvl3Features;
        }
        
        if(level>=4){
            lvl4Features+="<b>Ability Score Improvement:</b><br>";
            lvl4Features+=classJSON['Warlock']['Class Features']['Ability Score Improvement'];
        
            lvl4Element.innerHTML=lvl4Features;
        }
        
        if(level>=5){
            lvl5Features+="<b>Invocations:</b><br><br>";
            lvl5Features+="<b>Mire the Mind:</b><br>";
            lvl5Features+=classJSON['Warlock']['Eldritch Invocations']['Mire the Mind']['content'].join("<br>")+"<br><br>";
            lvl5Features+="<b>One With Shadows:</b><br>";
            lvl5Features+=classJSON['Warlock']['Eldritch Invocations']['One with Shadows']['content'].join("<br>")+"<br><br>";
            lvl5Features+="<b>Sign of Ill Omen:</b><br>";
            lvl5Features+=classJSON['Warlock']['Eldritch Invocations']['Sign of Ill Omen']['content'].join("<br>")+"<br><br>";
            lvl5Features+="<b>Thirsting Blade:</b><br>";
            lvl5Features+=classJSON['Warlock']['Eldritch Invocations']['Thirsting Blade']['content'].join("<br>");
            
            lvl5Element.innerHTML=lvl5Features;
        }
        
        
        /*all not listed levels are spells, ASI, or invocations*/
        if(level>=6){
            lvl6Features+="<b>Dark One's Own Luck:</b><br>";
            lvl6Features+=classJSON['Warlock']['Otherworldly Patrons']['The Fiend']['Dark Ones Own Luck']['content'].join(" ");
            
            lvl6Element.innerHTML=lvl6Features;
        }
        
        if(level>=7){
            lvl7Features+="<b>Invocations:</b><br><br>";
            lvl7Features+="<b>Bewitching Whispers:</b><br>";
            lvl7Features+=classJSON['Warlock']['Eldritch Invocations']['Bewitching Whispers']['content'].join("<br>")+"<br><br>";
            lvl7Features+="<b>Dreadful Word:</b><br>";
            lvl7Features+=classJSON['Warlock']['Eldritch Invocations']['Dreadful Word']['content'].join("<br>")+"<br><br>";
            lvl7Features+="<b>Sculptor of Flesh:</b><br>";
            lvl7Features+=classJSON['Warlock']['Eldritch Invocations']['Sculptor of Flesh']['content'].join("<br>")+"<br><br>";
            
            lvl7Element.innerHTML=lvl7Features;
        }
        
        if(level>=9){
            lvl9Features+="<b>Invocations:</b><br><br>";
            lvl9Features+="<b>Ascendant Step:</b><br>";
            lvl9Features+=classJSON['Warlock']['Eldritch Invocations']['Ascendant Step']['content'].join("<br>")+"<br><br>";
            lvl9Features+="<b>Minions of Chaos:</b><br>";
            lvl9Features+=classJSON['Warlock']['Eldritch Invocations']['Minions of Chaos']['content'].join("<br>")+"<br><br>";
            lvl9Features+="<b>Otherworldly Leap:</b><br>";
            lvl9Features+=classJSON['Warlock']['Eldritch Invocations']['Otherworldly Leap']['content'].join("<br>")+"<br><br>";
            lvl9Features+="<b>Whispers of the Grave:</b><br>";
            lvl9Features+=classJSON['Warlock']['Eldritch Invocations']['Whispers of the Grave']['content'].join("<br>")+"<br><br>";
            
            lvl9Element.innerHTML=lvl9Features;
        }
        
        if(level>=10){
            lvl10Features+="<b>Fiendish Resilience:</b><br>";
            lvl10Features+=classJSON['Warlock']['Otherworldly Patrons']['The Fiend']['Fiendish Resilience'];
            
            lvl10Element.innerHTML=lvl10Features;
        }
        
        if(level>=11){
            lvl11Features+="<b>Mystic Arcanum:</b><br>";
            lvl11Features+=classJSON['Warlock']['Class Features']['Mystic Arcanum']['content'].join(" ");
            
            lvl11Element.innerHTML=lvl11Features;
        }
        
        if(level>=12){
            lvl12Features+="<b>Invocations:</b><br><br>";
            lvl12Features+="<b>Lifedrinker:</b><br>";
            lvl12Features+=classJSON['Warlock']['Eldritch Invocations']['Lifedrinker']['content'].join("<br>");
            
            lvl12Element.innerHTML=lvl12Features;
        }
        
        if(level>=14){
            lvl14Features+="<b>Hurl Through Hell:</b><br>";
            lvl14Features+=classJSON['Warlock']['Otherworldly Patrons']['The Fiend']['Hurl Through Hell']['content'].join(" ");
            
            lvl14Element.innerHTML=lvl14Features;
        }
        
        if(level>=15){
            lvl15Features+="<b>Invocations:</b><br><br>";
            lvl15Features+="<b>Chains of Carceri:</b><br>";
            lvl15Features+=classJSON['Warlock']['Eldritch Invocations']['Chains of Carceri']['content'].join("<br>")+"<br><br>";
            lvl15Features+="<b>Master of Myriad Form:</b><br>";
            lvl15Features+=classJSON['Warlock']['Eldritch Invocations']['Master of Myriad Forms']['content'].join("<br>")+"<br><br>";
            lvl15Features+="<b>Visions of Distant Realms:</b><br>";
            lvl15Features+=classJSON['Warlock']['Eldritch Invocations']['Visions of Distant Realms']['content'].join("<br>")+"<br><br>";
            lvl15Features+="<b>Witch Sight:</b><br>";
            lvl15Features+=classJSON['Warlock']['Eldritch Invocations']['Witch Sight']['content'].join("<br>");
            
            lvl15Element.innerHTML=lvl15Features;
        }
        
        if(level==20){
            lvl20Features+="<b>Eldritch Master:</b><br>";
            lvl20Features+=classJSON['Warlock']['Class Features']['Eldritch Master'];
            
            lvl20Element.innerHTML=lvl20Features;
        }
        
        
        var warlockCantrips = spellJSON['Spellcasting']['Spell Lists']['Warlock Spells']['Cantrips (0 Level)'];
        var warlockLvl1Spells = spellJSON['Spellcasting']['Spell Lists']['Warlock Spells']['1st Level'];
        var allSpells = spellJSON['Spellcasting']['Spell Descriptions'];
        
        
        //var spellsElement = document.getElementById("final spells");
        var spell1String="<br><br>";
        var cantripString="<br><br>";
        for(var i=0;i<warlockCantrips.length;i++){
            cantripString+="<button class=\"collapsible\">"+warlockCantrips[i]+"</button><div class=\"content\">";
            cantripString+=allSpells[warlockCantrips[i]]['content'].join("<br>")+"</div><br><br>";
        }
        for(var i=0;i<warlockLvl1Spells.length;i++){
            spell1String+="<button class=\"collapsible\">"+warlockLvl1Spells[i]+"</button><div class=\"content\">";
            spell1String+=allSpells[warlockLvl1Spells[i]]['content'].join("<br>")+"</div><br><br>";
        }
        
        document.getElementsByClassName("mainContent")[0].innerHTML=cantripString;
        document.getElementsByClassName("mainContent")[1].innerHTML=spell1String;
        
        if(level>=3){
            var warlockLvl2Spells = spellJSON['Spellcasting']['Spell Lists']['Warlock Spells']['2nd Level'];
            var spell2String="<br><br>";
            for(var i=0;i<warlockLvl2Spells.length;i++){
                spell2String+="<button class=\"collapsible\">"+warlockLvl2Spells[i]+"</button><div class=\"content\">";
                spell2String+=allSpells[warlockLvl2Spells[i]]['content'].join("<br>")+"</div><br><br>";
            }
            document.getElementsByClassName("mainContent")[2].innerHTML=spell2String;
        }
        
        if(level>=5){
            var warlockLvl3Spells = spellJSON['Spellcasting']['Spell Lists']['Warlock Spells']['3rd Level'];
            var spell3String="<br><br>";
            for(var i=0;i<warlockLvl3Spells.length;i++){
                spell3String+="<button class=\"collapsible\">"+warlockLvl3Spells[i]+"</button><div class=\"content\">";
                spell3String+=allSpells[warlockLvl3Spells[i]]['content'].join("<br>")+"</div><br><br>";
            }
            document.getElementsByClassName("mainContent")[3].innerHTML=spell3String;
        }
        
        if(level>=7){
            var warlockLvl4Spells = spellJSON['Spellcasting']['Spell Lists']['Warlock Spells']['4th Level'];
            var spell4String="<br><br>";
            for(var i=0;i<warlockLvl4Spells.length;i++){
                spell4String+="<button class=\"collapsible\">"+warlockLvl4Spells[i]+"</button><div class=\"content\">";
                spell4String+=allSpells[warlockLvl4Spells[i]]['content'].join("<br>")+"</div><br><br>";
            }
            document.getElementsByClassName("mainContent")[4].innerHTML=spell4String;
        }
        
        if(level>=9){
            var warlockLvl5Spells = spellJSON['Spellcasting']['Spell Lists']['Warlock Spells']['5th Level'];
            var spell5String="<br><br>";
            for(var i=0;i<warlockLvl5Spells.length;i++){
                spell5String+="<button class=\"collapsible\">"+warlockLvl5Spells[i]+"</button><div class=\"content\">";
                spell5String+=allSpells[warlockLvl5Spells[i]]['content'].join("<br>")+"</div><br><br>";
            }
            document.getElementsByClassName("mainContent")[5].innerHTML=spell5String;
        }
        
        if(level>=11){
            var warlockLvl6Spells = spellJSON['Spellcasting']['Spell Lists']['Warlock Spells']['6th Level'];
            var spell6String="<br><br>";
            for(var i=0;i<warlockLvl6Spells.length;i++){
                spell6String+="<button class=\"collapsible\">"+warlockLvl6Spells[i]+"</button><div class=\"content\">";
                spell6String+=allSpells[warlockLvl6Spells[i]]['content'].join("<br>")+"</div><br><br>";
            }
            document.getElementsByClassName("mainContent")[6].innerHTML=spell6String;
        }
        
        if(level>=13){
            var warlockLvl7Spells = spellJSON['Spellcasting']['Spell Lists']['Warlock Spells']['7th Level'];
            var spell7String="<br><br>";
            for(var i=0;i<warlockLvl7Spells.length;i++){
                spell7String+="<button class=\"collapsible\">"+warlockLvl7Spells[i]+"</button><div class=\"content\">";
                spell7String+=allSpells[warlockLvl7Spells[i]]['content'].join("<br>")+"</div><br><br>";
            }
            document.getElementsByClassName("mainContent")[7].innerHTML=spell7String;
        }
        
        if(level>=15){
            var warlockLvl8Spells = spellJSON['Spellcasting']['Spell Lists']['Warlock Spells']['8th Level'];
            var spell8String="<br><br>";
            for(var i=0;i<warlockLvl8Spells.length;i++){
                spell8String+="<button class=\"collapsible\">"+warlockLvl8Spells[i]+"</button><div class=\"content\">";
                spell8String+=allSpells[warlockLvl8Spells[i]]['content'].join("<br>")+"</div><br><br>";
            }
            document.getElementsByClassName("mainContent")[8].innerHTML=spell8String;
        }
        
        if(level>=17){
            var warlockLvl9Spells = spellJSON['Spellcasting']['Spell Lists']['Warlock Spells']['9th Level'];
            var spell9String="<br><br>";
            for(var i=0;i<warlockLvl9Spells.length;i++){
                spell9String+="<button class=\"collapsible\">"+warlockLvl9Spells[i]+"</button><div class=\"content\">";
                spell9String+=allSpells[warlockLvl9Spells[i]]['content'].join("<br>")+"</div><br><br>";
            }
            document.getElementsByClassName("mainContent")[9].innerHTML=spell9String;
        }
        

        //spellsElement.innerHTML=spellString;
        
        

        
    }
    
    
    /*wizard is only other class*/
    else{
        
        
        /*basic features for classes include hit points, proficiencies, and equipment*/
        basicFeaturesString+="<br><br>Hit Points: <br>" + classJSON['Wizard']['Class Features']['Hit Points']['content'][0] + "<br>";
        basicFeaturesString+=classJSON['Wizard']['Class Features']['Hit Points']['content'][1] + "<br>";
        basicFeaturesString+=classJSON['Wizard']['Class Features']['Hit Points']['content'][2] + "<br><br>";
        basicFeaturesString+="Proficiences:<br>";
        basicFeaturesString+=classJSON['Wizard']['Class Features']['Proficiencies']['content'][0]+"<br>";
        basicFeaturesString+=classJSON['Wizard']['Class Features']['Proficiencies']['content'][1]+"<br>";
        basicFeaturesString+=classJSON['Wizard']['Class Features']['Proficiencies']['content'][2]+"<br>";
        basicFeaturesString+=classJSON['Wizard']['Class Features']['Proficiencies']['content'][3]+"<br>";
        basicFeaturesString+=classJSON['Wizard']['Class Features']['Proficiencies']['content'][4]+"<br><br>";
        basicFeaturesString+="Equipment:<br>";
        basicFeaturesString+=classJSON['Wizard']['Class Features']['Equipment']['content'][0]+"<br>";
        basicFeaturesString+="- " + classJSON['Wizard']['Class Features']['Equipment']['content'][1][0]+"<br>";
        basicFeaturesString+="- " + classJSON['Wizard']['Class Features']['Equipment']['content'][1][1]+"<br>";
        basicFeaturesString+="- " + classJSON['Wizard']['Class Features']['Equipment']['content'][1][2]+"<br>";

        
        basicFeatures.innerHTML=basicFeaturesString;
        
        
        lvl1Features+="<b>Spellcasting:</b><br>";
        lvl1Features+=classJSON['Wizard']['Class Features']['Spellcasting']['content']+"<br><br>";
        lvl1Features+="<b>Cantrips:</b><br>";
        lvl1Features+=classJSON['Wizard']['Class Features']['Spellcasting']['Cantrips']+"<br><br>";
        lvl1Features+="<b>Spellbook:</b><br>";
        lvl1Features+=classJSON['Wizard']['Class Features']['Spellcasting']['Spellbook']+"<br><br>";
        lvl1Features+="<b>Preparing and Casting Spells:</b><br>";
        lvl1Features+=classJSON['Wizard']['Class Features']['Spellcasting']['Preparing and Casting Spells']['content'].join(" ")+"<br><br>";
        lvl1Features+="<b>Spellcasting Ability:</b><br>";
        lvl1Features+=classJSON['Wizard']['Class Features']['Spellcasting']['Spellcasting Ability']['content'].join("<br>")+"<br><br>";
        lvl1Features+="<b>Ritual Casting:</b><br>";
        lvl1Features+=classJSON['Wizard']['Class Features']['Spellcasting']['Ritual Casting']+"<br><br>";
        lvl1Features+="<b>Spellcasting Focus:</b><br>";
        lvl1Features+=classJSON['Wizard']['Class Features']['Spellcasting']['Spellcasting Focus']+"<br><br>";
        lvl1Features+="<b>Learning Spells of 1st Level and Higher:</b><br>";
        lvl1Features+=classJSON['Wizard']['Class Features']['Spellcasting']['Learning Spells of 1st Level and Higher']+"<br><br>";
        lvl1Features+="<b>Arcane Recovery:</b><br>";
        lvl1Features+=classJSON['Wizard']['Class Features']['Arcane Recovery']['content'].join(" ")+"<br><br>";
        
        /*extra wizard fluff*/
        lvl1Features+=classJSON['Wizard']['Arcane Traditions']['Your Spellbook']['content'].join(" ");
        
        lvl1Element.innerHTML=lvl1Features;
        
        if(level>=2){
            lvl2Features+="<b>Arcane Tradition:</b><br>";
            lvl2Features+=classJSON['Wizard']['Class Features']['Arcane Tradition']['content'].join(" ")+"<br><br>";
            lvl2Features+="<b>Arcane Traditions:</b><br>";
            lvl2Features+=classJSON['Wizard']['Arcane Traditions']['content']+"<br><br>";
            lvl2Features+="<b>School of Evocation:</b><br>";
            lvl2Features+=classJSON['Wizard']['Arcane Traditions']['School of Evocation']['content']+"<br><br>";
            lvl2Features+="<b>Evocation Savant:</b><br>";
            lvl2Features+=classJSON['Wizard']['Arcane Traditions']['School of Evocation']['Evocation Savant']+"<br><br>";
            lvl2Features+="<b>Sculpt Spells:</b><br>";
            lvl2Features+=classJSON['Wizard']['Arcane Traditions']['School of Evocation']['Sculpt Spells']+"<br><br>";

            
            lvl2Element.innerHTML=lvl2Features;
        }
        
        /*every not listed level is spells or ASIs*/
        
        if(level>=4){
            lvl4Features+="<b>Ability Score Improvement:</b><br>";
            lvl4Features+=classJSON['Wizard']['Class Features']['Ability Score Improvement'];
            
            lvl4Element.innerHTML=lvl4Features;
        }
        
        if(level>=6){
            lvl6Features+="<b>Potent Cantrip:</b><br>";
            lvl6Features+=classJSON['Wizard']['Arcane Traditions']['School of Evocation']['Potent Cantrip'];
            
            lvl6Element.innerHTML=lvl6Features;
        }
        
        if(level>=10){
            lvl10Features+="<b>Empowred Evocation:</b><br>";
            lvl10Features+=classJSON['Wizard']['Arcane Traditions']['School of Evocation']['Empowered Evocation'];
            
            lvl10Element.innerHTML=lvl10Features;
        }
        
        if(level>=14){
            lvl14Features+="<b>Overchannel:</b><br>";
            lvl14Features+=classJSON['Wizard']['Arcane Traditions']['School of Evocation']['Overchannel']['content'].join(" ");
            
            lvl14Element.innerHTML=lvl14Features;
        }
        
        if(level>=18){
            lvl18Features+="<b>Spell Mastery:</b><br>";
            lvl18Features+=classJSON['Wizard']['Class Features']['Spell Mastery']['content'];
            
            lvl18Element.innerHTML=lvl18Features;
        }
        
        if(level==20){
            lvl20Features+="<b>Signature Spells:</b><br>";
            lvl20Features+=classJSON['Wizard']['Class Features']['Signature Spells']['content'];
            
            lvl20Element.innerHTML=lvl20Features;
        }

    
    
    classPara.innerHTML=classText;
    
    
    
        var wizardCantrips = spellJSON['Spellcasting']['Spell Lists']['Wizard Spells']['Cantrips (0 Level)'];
        var wizardLvl1Spells = spellJSON['Spellcasting']['Spell Lists']['Wizard Spells']['1st Level'];
        var allSpells = spellJSON['Spellcasting']['Spell Descriptions'];
        
        
        //var spellsElement = document.getElementById("final spells");
        var spell1String="<br><br>";
        var cantripString="<br><br>";
        for(var i=0;i<wizardCantrips.length;i++){
            cantripString+="<button class=\"collapsible\">"+wizardCantrips[i]+"</button><div class=\"content\">";
            cantripString+=allSpells[wizardCantrips[i]]['content'].join("<br>")+"</div><br><br>";
        }
        for(var i=0;i<wizardLvl1Spells.length;i++){
            spell1String+="<button class=\"collapsible\">"+wizardLvl1Spells[i]+"</button><div class=\"content\">";
            spell1String+=allSpells[wizardLvl1Spells[i]]['content'].join("<br>")+"</div><br><br>";
        }
    
    
        document.getElementsByClassName("mainContent")[0].innerHTML=cantripString;
    
        document.getElementsByClassName("mainContent")[1].innerHTML=spell1String;
        
        if(level>=3){
            var wizardLvl2Spells = spellJSON['Spellcasting']['Spell Lists']['Wizard Spells']['2nd Level'];
            var spell2String="<br><br>";
            for(var i=0;i<wizardLvl2Spells.length;i++){
                spell2String+="<button class=\"collapsible\">"+wizardLvl2Spells[i]+"</button><div class=\"content\">";
                spell2String+=allSpells[wizardLvl2Spells[i]]['content'].join("<br>")+"</div><br><br>";
            }
            document.getElementsByClassName("mainContent")[2].innerHTML=spell2String;
        }
        
        if(level>=5){
            var wizardLvl3Spells = spellJSON['Spellcasting']['Spell Lists']['Wizard Spells']['3rd Level'];
            var spell3String="<br><br>";
            for(var i=0;i<wizardLvl3Spells.length;i++){
                spell3String+="<button class=\"collapsible\">"+wizardLvl3Spells[i]+"</button><div class=\"content\">";
                spell3String+=allSpells[wizardLvl3Spells[i]]['content'].join("<br>")+"</div><br><br>";
            }
            document.getElementsByClassName("mainContent")[3].innerHTML=spell3String;
        }
        
        if(level>=7){
            var wizardLvl4Spells = spellJSON['Spellcasting']['Spell Lists']['Wizard Spells']['4th Level'];
            var spell4String="<br><br>";
            for(var i=0;i<wizardLvl4Spells.length;i++){
                spell4String+="<button class=\"collapsible\">"+wizardLvl4Spells[i]+"</button><div class=\"content\">";
                spell4String+=allSpells[wizardLvl4Spells[i]]['content'].join("<br>")+"</div><br><br>";
            }
            document.getElementsByClassName("mainContent")[4].innerHTML=spell4String;
        }
        
        if(level>=9){
            var wizardLvl5Spells = spellJSON['Spellcasting']['Spell Lists']['Wizard Spells']['5th Level'];
            var spell5String="<br><br>";
            for(var i=0;i<wizardLvl5Spells.length;i++){
                spell5String+="<button class=\"collapsible\">"+wizardLvl5Spells[i]+"</button><div class=\"content\">";
                spell5String+=allSpells[wizardLvl5Spells[i]]['content'].join("<br>")+"</div><br><br>";
            }
            document.getElementsByClassName("mainContent")[5].innerHTML=spell5String;
        }
        
        if(level>=11){
            var wizardLvl6Spells = spellJSON['Spellcasting']['Spell Lists']['Wizard Spells']['6th Level'];
            var spell6String="<br><br>";
            for(var i=0;i<wizardLvl6Spells.length;i++){
                spell6String+="<button class=\"collapsible\">"+wizardLvl6Spells[i]+"</button><div class=\"content\">";
                spell6String+=allSpells[wizardLvl6Spells[i]]['content'].join("<br>")+"</div><br><br>";
            }
            document.getElementsByClassName("mainContent")[6].innerHTML=spell6String;
        }
        
        if(level>=13){
            var wizardLvl7Spells = spellJSON['Spellcasting']['Spell Lists']['Wizard Spells']['7th Level'];
            var spell7String="<br><br>";
            for(var i=0;i<wizardLvl7Spells.length;i++){
                spell7String+="<button class=\"collapsible\">"+wizardLvl7Spells[i]+"</button><div class=\"content\">";
                spell7String+=allSpells[wizardLvl7Spells[i]]['content'].join("<br>")+"</div><br><br>";
            }
            document.getElementsByClassName("mainContent")[7].innerHTML=spell7String;
        }
        
        if(level>=15){
            var wizardLvl8Spells = spellJSON['Spellcasting']['Spell Lists']['Wizard Spells']['8th Level'];
            var spell8String="<br><br>";
            for(var i=0;i<wizardLvl8Spells.length;i++){
                spell8String+="<button class=\"collapsible\">"+wizardLvl8Spells[i]+"</button><div class=\"content\">";
                spell8String+=allSpells[wizardLvl8Spells[i]]['content'].join("<br>")+"</div><br><br>";
            }
            document.getElementsByClassName("mainContent")[8].innerHTML=spell8String;
        }
        
        if(level>=17){
            var wizardLvl9Spells = spellJSON['Spellcasting']['Spell Lists']['Wizard Spells']['9th Level'];
            var spell9String="<br><br>";
            for(var i=0;i<wizardLvl9Spells.length;i++){
                spell9String+="<button class=\"collapsible\">"+wizardLvl9Spells[i]+"</button><div class=\"content\">";
                spell9String+=allSpells[wizardLvl9Spells[i]]['content'].join("<br>")+"</div><br><br>";
            }
            document.getElementsByClassName("mainContent")[9].innerHTML=spell9String;
        }
        
        
        
    }
        
}


function resetLevelFeatures(arr){
    for(var i=0;i<arr.length;i++){
        arr[i].innerHTML="";
    }
}

/*hides or shows the proper collapsibles*/
function updateCollapsibles(baseClass, level){
    

    var coll = document.getElementsByClassName("mainCollapsible");
    
    
    //wipe all the spell levels, then re-add them if necessary
    
    //covers not-casters and casters with less than full progression
    for(var i=0;i<coll.length;i++){
        coll[i].style.display="none";
    }
    
    
    
    
    //fullcaster
        if(baseClass=="bard"||baseClass=="cleric"||baseClass=="druid"||baseClass=="sorcerer"||baseClass=="warlock"||baseClass=="wizard"){
            var maxSpellLevel = Math.ceil(level/2);
            
            //fix error when playing at level 19 or 20
            if(maxSpellLevel>9){
               maxSpellLevel=9;
            }
            
            //always show cantrips
            coll[20].style.display="inline";
            
            
            for(var i=1;i<=maxSpellLevel;i++){
                coll[20+i].style.display="inline";
            }
            
        }
        
        //half caster
        else if(baseClass=="paladin"||baseClass=="ranger"){
            var maxSpellLevel=0;
            if(level>=2){
               maxSpellLevel=1;
            }
            if(level>=5){
               maxSpellLevel=2;
            }
            if(level>=9){
                maxSpellLevel=3;
            }
            if(level>=13){
                maxSpellLevel=4;
            }
            if(level>=17){
                maxSpellLevel=5;
            }
            
            for(var i=1;i<=maxSpellLevel;i++){
                coll[20+i].style.display="inline";
            }
        }
    
    //handle class levels
    for(var i=0;i<level;i++){
        coll[i].style.display="inline";
    }
        
    /*handles all of the buttons we added in js*/    
    
    var subColl = document.getElementsByClassName("collapsible");
    var j;

    for (j = 0; j < subColl.length; j++) {
        subColl[j].addEventListener("click", function() {
            this.classList.toggle("active");
            var content = this.nextElementSibling;
            if (content.style.display === "block") {
                content.style.display = "none";
            } 
            else {
                content.style.display = "block";
            }
        });
         
    }
    
    
    
}