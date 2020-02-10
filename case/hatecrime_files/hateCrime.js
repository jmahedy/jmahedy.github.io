$(document).ready(function () {

    $("#emailAddress").click(function () {
        $("#Email_txt").focus();
    });

    $("#whoWasInjured").click(function () {
        $("#AnyoneInjuredDescription_txt").focus();
    });

    $("#descriptionOfProperty").click(function () {
        $("#ValueOfDamage_txt").focus();
    });

    $("#detailsOfWitnesses").click(function () {
        $("#WitnessDetails_txt").focus();
    });

    $("#doYouKnowThem").click(function () {
        $("#OffenderNameAddress_txt").focus();
    });

    $("#offendersHaveVehicle").click(function () {
        $("#OffendersVehicleDetails_txt").focus();
    });

    $("#interpreterRequired").click(function () {
        $("#PreferedLanguage_txt").focus();
    });

    $("#policeTelephoneYou").click(function () {
        $("#TelephoneContactMe_txt").focus();
    });

    $("#emailNotification").click(function () {
        $("#NotificationEmail_txt").focus();
    });

    var omit = "";
    var tval = "";

    $("#VictimWitness_dd").change(function () {
        tval = "";
        tval = $("#VictimWitness_dd option:selected").val();
        if (tval == 'Third_Party_Report') {
            $("#ThirdPartyPanel").removeClass('hidden');
            $("#ThirdPartyPanel").addClass('show');
        }
        else {
            $("#ThirdPartyPanel").removeClass('show');
            $("#ThirdPartyPanel").addClass('hidden');
        }
    });

    $("#Ethnicity_dd").change(function () {
        tval = $("#Ethnicity_dd option:selected").val();
        if (tval.indexOf('Other', 0) >= 0) {
            $("#OtherEthnicity").removeClass('hidden');
            $("#OtherEthnicity").addClass('show');
        }
        else {
            $("#OtherEthnicity").removeClass('show');
            $("#OtherEthnicity").addClass('hidden');
        }
    });

    $("#AnyoneInjured_rad").click(function () {
        tval = $('input[name$=AnyoneInjured_rad]:checked', '#Form1').attr('id').replace(omit, "");
        if (tval == "AnyoneInjured_rad_1") {
            $("#InjuredPanel").removeClass('hidden');
            $("#InjuredPanel").addClass('show');
        }
        else {
            $("#InjuredPanel").removeClass('show');
            $("#InjuredPanel").addClass('hidden');
        }
    });

    $("#LossOrDamage_rad").click(function () {
        tval = "";
        tval = $('input[name$=LossOrDamage_rad]:checked', '#Form1').attr('id').replace(omit, "");
        if (tval == "LossOrDamage_rad_1") {
            $("#damagePanel").removeClass('hidden');
            $("#damagePanel").addClass('show');
        }
        else {
            $("#damagePanel").removeClass('show');
            $("#damagePanel").addClass('hidden');
        }
    });

    $("#Witnesses_rad").click(function () {
        tval = "";
        tval = $('input[name$=Witnesses_rad]:checked', '#Form1').attr('id').replace(omit, "");
        if (tval == "Witnesses_rad_1") {
            $("#witnessPanel").removeClass('hidden');
            $("#witnessPanel").addClass('show');
        }
        else {
            $("#witnessPanel").removeClass('show');
            $("#witnessPanel").addClass('hidden');
        }
    });

    $("#DoYouKnowThem_rad").click(function () {
        tval = "";
        tval = $('input[name$=DoYouKnowThem_rad]:checked', '#Form1').attr('id').replace(omit, "");
        if (tval == "DoYouKnowThem_rad_1") {
            $("#knowthemPanel").removeClass('hidden');
            $("#knowthemPanel").addClass('show');
        }
        else {
            $("#knowthemPanel").removeClass('show');
            $("#knowthemPanel").addClass('hidden');
        }
    });

    $("#OffendersVehicle_rad").click(function () {
        tval = "";
        tval = $('input[name$=OffendersVehicle_rad]:checked', '#Form1').attr('id').replace(omit, "");
        if (tval == "OffendersVehicle_rad_1") {
            $("#vehiclePanel").removeClass('hidden');
            $("#vehiclePanel").addClass('show');
        }
        else {
            $("#vehiclePanel").removeClass('show');
            $("#vehiclePanel").addClass('hidden');
        }
    });

    $("#InterpreterRequired_rad").click(function () {
        tval = "";
        tval = $('input[name$=InterpreterRequired_rad]:checked', '#Form1').attr('id').replace(omit, "");
        if (tval == "InterpreterRequired_rad_1") {
            $("#interpreterPanel").removeClass('hidden');
            $("#interpreterPanel").addClass('show');
        }
        else {
            $("#interpreterPanel").removeClass('show');
            $("#interpreterPanel").addClass('hidden');
        }
    });

    $("#PoliceContactPhone_rad").click(function () {
        tval = "";
        tval = $('input[name$=PoliceContactPhone_rad]:checked', '#Form1').attr('id').replace(omit, "");
        if (tval == "PoliceContactPhone_rad_1") {
            $("#phonePanel").removeClass('hidden');
            $("#phonePanel").addClass('show');
        }
        else {
            $("#phonePanel").removeClass('show');
            $("#phonePanel").addClass('hidden');
        }
    });

    $("#PoliceAttendInPerson_rad").click(function () {
        tval = "";
        tval = $('input[name$=PoliceAttendInPerson_rad]:checked', '#Form1').attr('id').replace(omit, "");
        if (tval == "PoliceAttendInPerson_rad_1") {
            $("#attendPanel").removeClass('hidden');
            $("#attendPanel").addClass('show');
        }
        else {
            $("#attendPanel").removeClass('show');
            $("#attendPanel").addClass('hidden');
        }
    });

});