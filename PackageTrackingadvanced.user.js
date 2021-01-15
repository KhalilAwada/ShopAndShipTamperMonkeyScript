// ==UserScript==
// @name         PackageTrackingadvanced
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @downloadURL  https://github.com/KhalilAwada/ShopAndShipTamperMonkeyScript/raw/main/PackageTrackingadvanced.user.js
// @@updateURL   https://github.com/KhalilAwada/ShopAndShipTamperMonkeyScript/raw/main/PackageTrackingadvanced.user.js
// @match        https://www.shopandship.com/*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @require      https://gist.github.com/raw/2625891/waitForKeyElements.js
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// ==/UserScript==

(function() {
    'use strict';
     unsafeWindow.sns={};
     unsafeWindow.sns.pack_table =null;
     unsafeWindow.sns.suppliers =[]//{code:'42011413',name:'Amazon USA',img:'https://cdn0.iconfinder.com/data/icons/most-usable-logos/120/Amazon-512.png'},{code:'0065479015651599',name:'Bike-Discount',img:'https://www.bike-discount.de//custom/module/media/apple-touch-icon-57x57-precomposed.png'}];
     unsafeWindow.sns.packages ={}
     GM_addStyle('.code.sns{color: #c7254e;background-color: #f9f2f4;white-space: nowrap; font-size:10px; width: 180px;overflow: hidden;text-overflow: ellipsis; border: thin solid #000000;} .sns_detail_green{background-color:#dbf7d9!important;} .sns_accordion {  background-color: #eee;  color: #444;  cursor: pointer;  padding:5px;  width: 100%;  border: none;  text-align: left;  outline: none;  font-size: 15px;  transition: 0.4s;}.sns_active, .sns_accordion:hover {  background-color: #ccc; }.sns_panel {  padding: 0 18px;  display: none;  background-color: white;  overflow: hidden;}');
     waitForKeyElements (".widgets-area", actionWidgetsAreaFunction);
     waitForKeyElements ('[translate="tracking.supllierTrackingNoLbl"]', actionDetailAreaFunction);
     waitForKeyElements ("#no-more-tables", actionPackageTableFunction);


     unsafeWindow.sns.getSupplierFromSNSCode=function(code){
         let supplier={code:code,name:'unknown',img:'https://cdn2.iconfinder.com/data/icons/alzheimer-s/512/Alzheimer-disease-brain-disorder-forgot-11-512.png'};
         unsafeWindow.sns.suppliers.forEach((sup,ind)=>{
             if(code.includes(sup.code)){
                  supplier= sup;
             }
         })
         return supplier
     }

    // Your code here...

     unsafeWindow.sns.getSuppliersFromLocalStorage=function(){
         unsafeWindow.sns.suppliers=[]
         let sns_suppliers=GM_getValue('sns_suppliers');
         console.log('GM_getValue',sns_suppliers)
         if(!!sns_suppliers){
             try{
                 sns_suppliers=JSON.parse(sns_suppliers);
                 if(Array.isArray(sns_suppliers)){
                     unsafeWindow.sns.suppliers=sns_suppliers
                 }
             }catch(err){}
         }
         console.log('get suppliers',unsafeWindow.sns.suppliers)
         return unsafeWindow.sns.suppliers
     }
     unsafeWindow.sns.getPackagesFromLocalStorage=function(){
         unsafeWindow.sns.packages={}
         let sns_packages=GM_getValue('sns_packages');
         console.log('GM_getValue',sns_packages)
         if(!!sns_packages){
             try{
                 sns_packages=JSON.parse(sns_packages);
                 unsafeWindow.sns.packages=sns_packages
             }catch(err){}
         }
         console.log('get packages',unsafeWindow.sns.packages)
         return unsafeWindow.sns.packages
     }
     unsafeWindow.sns.getPackagesFromLocalStorage();
     unsafeWindow.sns.getSuppliersFromLocalStorage();
     unsafeWindow.sns.addSupplierFormSubmit=function(form){
         let new_sup={};
         sns.getSuppliersFromLocalStorage()
         var unindexed_array = form.serializeArray();
         var indexed_array = {};

         $.map(unindexed_array, function(n, i){
             indexed_array[n['name'].replace('sup_','')] = n['value'];
         });
         new_sup=indexed_array
         form[0].reset()
         let sup_exists=unsafeWindow.sns.getSupplierFromSNSCode(new_sup.code)
         console.log(sup_exists)
         if(sup_exists.name != 'unknown'){
             unsafeWindow.sns.suppliers.forEach((sup,ind)=>{
                 if(sup_exists.code==sup.code){
                      unsafeWindow.sns.suppliers[ind]=new_sup;
                 }
             })
         }else{
             unsafeWindow.sns.suppliers.push(new_sup);
         }
         GM_setValue('sns_suppliers',JSON.stringify(unsafeWindow.sns.suppliers));
         window.location.reload()
     }



     unsafeWindow.sns.addPackageFormSubmit=function(form){
         let new_pkg={};
         console.log('addPackageFormSubmit')
         sns.getSuppliersFromLocalStorage()
         var unindexed_array = form.serializeArray();
         var indexed_array = {};

         $.map(unindexed_array, function(n, i){
             indexed_array[n['name'].replace('pkg_','')] = n['value'];
         });
         new_pkg=indexed_array
         form[0].reset()
         if(!new_pkg.sns_code){
             return
         }
         if(!unsafeWindow.sns.packages[new_pkg.sns_code]){
             unsafeWindow.sns.packages[new_pkg.sns_code]={}
         }
         for (var key of Object.keys(new_pkg)) {
             unsafeWindow.sns.packages[new_pkg.sns_code][key]=new_pkg[key]
         }

         GM_setValue('sns_packages',JSON.stringify(unsafeWindow.sns.packages));
     }



    // Your code here...

    function actionPackageTableFunction (PackTable) {
        //-- DO WHAT YOU WANT TO THE TARGETED ELEMENTS HERE.
        //PackTable.css ("background", "repeating-linear-gradient(  -55deg,  #ddd,  #ccc 10px,  #ddd 10px,  #fff 20px"); // example
        $('.widgets-area').parent('.col-md-4').removeClass('col-md-4').addClass('col-md-3');
        $('.page-content').parent('.col-md-8').removeClass('col-md-8').addClass('col-md-9');
        //PackTable.find('a').attr('target','_blank')
        let trs=PackTable.find('tr')
//        $('<th>Tracking NO.</th>').insertAfter($(trs[0]).find('th[translate="account.packages.table.supplierCol"]'))
        trs.each((index,value)=>{
            if(index ==0){return}
            let trnode=$(value)
            console.log('index',index)
            console.log('value',value)
            console.log('trnode',trnode.html())
            let sns_code=trnode.find('td[data-title="Shipment NO."]').text().trim()
            console.log('sns_code',sns_code)
            let suppliernode=trnode.find('td[data-title="Supplier"]')

            if(unsafeWindow.sns.packages[sns_code]){
                console.log('trx',unsafeWindow.sns.packages[sns_code]['supplier_code'])
                let supplier=unsafeWindow.sns.getSupplierFromSNSCode(unsafeWindow.sns.packages[sns_code]['supplier_code']);
                if(supplier){
                    console.log('>>supplier',supplier)

                    suppliernode.html('<span title="'+suppliernode.text()+'"><img height="20" src="'+supplier.img+'"/> '+supplier.name+'</span><br>'+
                                      '<div class="code sns">'+unsafeWindow.sns.packages[sns_code]['supplier_tracking_code']+'</div>')
                }
            }
/*            if(unsafeWindow.sns.packages[sns_code] && unsafeWindow.sns.packages[sns_code]['supplier_tracking_code']){
                $('<td data-title="Tracking"><div class="code sns">'+unsafeWindow.sns.packages[sns_code]['supplier_tracking_code']+'</div></td>').insertAfter(suppliernode)
            }else{
                $('<td data-title="Tracking"></td>').insertAfter(suppliernode)
            }*/
        })



    }
    function actionDetailAreaFunction (detailArea) {
        let supplierTrackingNoLbl=detailArea//$('[translate="tracking.supllierTrackingNoLbl"]');
        let supplierTrackingNoLblSibling=supplierTrackingNoLbl.next();
        let supplierTrackingWeight=$('[translate="tracking.weightLbl"]')
        let supplierTrackingWeightSibling=supplierTrackingWeight.next()
        let sns_code=$('.details > .detail:first > div:nth(1)').text()
        let supplier=null
        if(!unsafeWindow.sns.packages[sns_code]){
            console.log('new package')
            let supplierTrackingCode=supplierTrackingNoLblSibling.text().trim();
            supplier=unsafeWindow.sns.getSupplierFromSNSCode(supplierTrackingCode);
            let weight=Math.round(((parseFloat(supplierTrackingWeightSibling.text().trim().replace(' lb',''))*0.453593)+ Number.EPSILON) * 100) / 100
            let new_packages={
                sns_code:sns_code,
                supplier_code:supplier.code,
                supplier_tracking_code:supplierTrackingCode.replace(supplier.code,''),
                weight:weight+' kg'
            }
            let submitForm=$('<form onsubmit="sns.addPackageFormSubmit($(this));return false;"></form>')
            for (var key of Object.keys(new_packages)) {
                submitForm.append('<input name="'+key+'" value="'+new_packages[key]+'" />')
            }
            submitForm.submit()
        }else{console.log('old package')}


        supplier=unsafeWindow.sns.getSupplierFromSNSCode(unsafeWindow.sns.packages[sns_code]['supplier_code']);
        let befour=$('[translate="tracking.supllierTrackingNoLbl"]').parent('.detail')
        let trackdom=$('[translate="tracking.supllierTrackingNoLbl"]')
        let suppdom=$('[translate="tracking.supplierLbl"]')
        if(unsafeWindow.sns.packages[sns_code]['supplier_tracking_code']){
            trackdom.parent().addClass('sns_detail_green')
            trackdom.next().append('<br><div class="sns code" style="margin-left:5px;margin-top:5px">'+unsafeWindow.sns.packages[sns_code]['supplier_tracking_code']+'</div>')
            //$('<div class="detail sns_detail_green"><div class="name">Tracking No:</div><div>'+unsafeWindow.sns.packages[sns_code]['supplier_tracking_code']+'</div></div>').insertAfter(befour)
            //$('.details').append('<div class="detail sns_detail_green"><div class="name">Tracking No:</div><div>'+unsafeWindow.sns.packages[sns_code]['supplier_tracking_code']+'</div></div>')
        }
        if(supplier){
            suppdom.parent().addClass('sns_detail_green')
            suppdom.next().append('<br><img height="20" src="'+supplier.img+'"/> '+supplier.name)

            //$('<div class="detail sns_detail_green"><div class="name">Supplier:</div><div><img height="20" src="'+supplier.img+'"/> '+supplier.name+'</div></div>').insertAfter(befour)
            //$('.details').append('<div class="detail sns_detail_green"><div class="name">Supplier:</div><div><img height="20" src="'+supplier.img+'"/> '+supplier.name+'</div></div>')
        }
        if(unsafeWindow.sns.packages[sns_code]['weight']){
            $('[translate="tracking.weightLbl"]').parent().addClass('sns_detail_green')
            $('[translate="tracking.weightLbl"]').next().append(' - '+unsafeWindow.sns.packages[sns_code]['weight'])
        }
    }
    function actionWidgetsAreaFunction (widgetsArea) {
        let widgetContentDiv= $('<div class="widget-box help-box"><div class="widget-title"><h4>Supplier Box</h4></div></div>');
        let listSupplierBtn=$('<button class="sns_accordion">List Supplier</button>');
        let addSupplierBtn=$('<button class="sns_accordion">Add Supplier</button>');
        let addSupplierForm=$('<form onsubmit="sns.addSupplierFormSubmit($(this));return false;" class="form-horizontal"><div class="form-group row"><label for="sup_code" class="col-sm-2 control-label">Code</label><div class="col-sm-10"><input type="text" class="form-control" id="sup_code" name="sup_code" placeholder="234523452345"></div></div>'
                                    +'<div class="form-group row"><label for="sup_name" class="col-sm-2 control-label">Name</label><div class="col-sm-10"><input type="text" class="form-control" id="sup_name" name="sup_name" placeholder="Amazon USA"></div></div>'
                                    +'<div class="form-group row"><label for="sup_img" class="col-sm-2 control-label">Logo</label><div class="col-sm-10"><input type="text" class="form-control" id="sup_img" name="sup_img" placeholder="https://cdn0.iconfinder.com/data/icons/most-usable-logos/120/Amazon-512.png"></div></div>'
                                    +'<div class="form-group"><div class="col-sm-offset-2 col-sm-10"><button type="submit" class="btn btn-default">Sign in</button></div></div></form>')
        let suppliersTable=$('<table class="table table-sm"></table>');
        unsafeWindow.sns.suppliers.forEach((sup,ind)=>{
            suppliersTable.append('<tr><td><img height="20" src="'+sup.img+'"/></td><td>'+sup.name+'</td><td>'+sup.code+'</td></tr>');
        });
        widgetContentDiv.append(listSupplierBtn);
        widgetContentDiv.append('<div class="sns_panel"></div>');
        widgetContentDiv.find('.sns_panel').append(suppliersTable);
        widgetContentDiv.append(addSupplierBtn);
        widgetContentDiv.append($('<div class="sns_panel"></div>').append(addSupplierForm));
        widgetsArea.prepend(widgetContentDiv);

        var acc = document.getElementsByClassName("sns_accordion");
        var i;

        for (i = 0; i < acc.length; i++) {
            acc[i].addEventListener("click", function() {
                this.classList.toggle("sns_active");
                var panel = this.nextElementSibling;
                if (panel.style.display === "block") {
                    panel.style.display = "none";
                } else {
                    panel.style.display = "block";
                }
            });
        }

    }
    // Your code here...
})();