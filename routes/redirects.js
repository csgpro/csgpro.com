/*jslint
  node: true*/

'use strict';

var map = {
  '/Blogs/post/2013/07/23/Importing-Excel-Forms-into-SharePoint-via-InfoPath.aspx'                                                     : 19,
  '/Blogs/post/2013/07/16/Enabling-E-Mails-to-Trigger-SharePoint-List-Workflows.aspx'                                                  : 17,
  '/Blogs/post/2013/06/28/BUILD.aspx'                                                                                                  : 14,
  '/Blogs/post/2013/06/17/Automating-Azure-SQL-Database-Backups.aspx'                                                                  : 13,
  '/Blogs/post/2013/01/29/Applying-Business-Rules-in-Master-Data-Services.aspx'                                                        : 12,
  '/Blogs/post/2012/12/19/Free-Public-Surveys-with-SkyDrive.aspx'                                                                      : 2,
  '/Blogs/post/2012/11/20/Free-Virtual-Machines-with-Windows-8.aspx'                                                                   : 11,
  '/Blogs/post/2012/11/20/Keeping-It-Light-Rich-UX-Using-JScript-CSOM-Only.aspx'                                                       : 48,
  '/Blogs/post/2012/11/20/What-is-new-with-SharePoint-2013.aspx'                                                                       : 68,
  '/Blogs/post/2012/11/19/Tips-and-Tricks-–-Handy-String-Extension-Methods.aspx'                                                       : 66,
  '/Blogs/post/2012/10/24/Creating-an-Azure-VM-with-SQL-Server-2012.aspx'                                                              : 32,
  '/Blogs/post/2012/10/18/Introduction-to-Code-First-Migrations.aspx'                                                                  : 46,
  '/Blogs/post/2012/10/18/So-Many-Login-Prompts-–-The-Solution.aspx'                                                                   : 62,
  '/Blogs/post/2012/10/18/Hiding-SharePoint-Fields-Using-jQuery.aspx'                                                                  : 41,
  '/Blogs/post/2012/09/13/Developing-with-Windows-Azure.aspx'                                                                          : 35,
  '/Blogs/post/2012/09/13/Formatting-Data-for-Analysis.aspx'                                                                           : 39,
  '/Blogs/post/2012/09/13/Jumpstart-Development-with-Entity-Framework-Code-First.aspx'                                                 : 47,
  '/Blogs/post/2012/08/15/SharePoint-2010-Search-Quick-Win-–-Sorting-by-Modified-Date.aspx'                                            : 58,
  '/Blogs/post/2012/08/15/PowerPivot-Pitfall-With-RSS-Feed-Datasources.aspx'                                                           : 55,
  '/Blogs/post/2012/08/15/Increase-Site-Template-Limit-of-50-MB.aspx'                                                                  : 44,
  '/Blogs/post/2012/08/15/Lights-Action-Camera!.aspx'                                                                                  : 50,
  '/Blogs/post/2012/07/18/Goodbye-VLOOKUP-Hello-PowerPivot.aspx'                                                                       : 40,
  '/Blogs/post/2012/07/17/Boost-End-Users-Productivity-with-SharePoint-Content-Ratings.aspx'                                           : 28,
  '/Blogs/post/2012/07/17/Open-Source-ASPNET.aspx'                                                                                     : 53,
  '/Blogs/post/2012/06/06/Time-Zone-Alphabet-Soup-DST-ST-MT-and-Arizona.aspx'                                                          : 65,
  '/Blogs/post/2012/06/06/Boost-End-Users-Productivity-with-SharePoint-IA-OOB-Functions.aspx'                                          : 29,
  '/Blogs/post/2012/05/17/CSG-Pro-Fastest-Growing-Private-100-Company!.aspx'                                                           : 34,
  '/Blogs/post/2012/05/10/SharePoint-for-Beginners-.aspx'                                                                              : 60,
  '/Blogs/post/2012/05/10/What’s-New-in-Visual-Studio-11.aspx'                                                                         : 68,
  '/Blogs/post/2012/05/10/How-to-Guarantee-Your-SharePoint-Upgrade-Plan-Will-Fail-Miserably.aspx'                                      : 43,
  '/Blogs/post/2012/05/10/Elements-of-a-successful-project-kickoff-meeting.aspx'                                                       : 37,
  '/Blogs/post/2012/04/15/Being-Responsive-to-Change.aspx'                                                                             : 27,
  '/Blogs/post/2012/04/09/SharePoint-The-Glorified-Shared-Drive.aspx'                                                                  : 57,
  '/Blogs/post/2012/04/02/Building-CSG-in-the-Cloud-Part-2.aspx'                                                                       : 31,
  '/Blogs/post/2012/03/07/SharePoint-Deployment-Best-Practices-The-Role-of-PowerShell-vs-Compiled-Feature-and-Solution-Packaging.aspx' : 59,
  '/Blogs/post/2012/03/05/InnoTech-May-3rd-2012.aspx'                                                                                  : 45,
  '/Blogs/post/2012/02/27/The-Power-of-Trust-in-Action!.aspx'                                                                          : 64,
  '/Blogs/post/2012/02/27/Why-Partner-with-Microsoft.aspx'                                                                             : 70,
  '/Blogs/post/2012/02/27/SharePoint-Power-Users-Friend-or-Foe-.aspx'                                                                  : 61,
  '/Blogs/post/2012/02/21/Planning-a-Succesful-Deployment.aspx'                                                                        : 54,
  '/Blogs/post/2012/02/15/Guest-Post-Amanda-Hill-From-Microsoft-tells-us-about-Best-Practices!.aspx'                                   : 42,
  '/Blogs/post/2012/02/15/My-Music-PowerPivot.aspx'                                                                                    : 52,
  '/Blogs/post/2012/02/15/Discussion-Time-Analytics-Business-Intelligence-in-the-Trenches.aspx'                                        : 36,
  '/Blogs/post/2012/02/15/5-Defining-Traits-of-Great-Consultants.aspx'                                                                 : 25,
  '/Blogs/post/2012/01/11/2011-Is-Growth-Enough.aspx'                                                                                  : 26
};

module.exports = function(req, res) {
  var postId;
  var url = req.url;
  var clearnUrl = url.match(/.+\.aspx/i);
      clearnUrl = escape(clearnUrl.toString().toLowerCase());


  Object.keys(map).forEach(function(item) {
    var cleanItem = escape(item.toLowerCase());

    if (cleanItem === clearnUrl)
      postId = map[item];
  });

  console.log('Old post lookup: ', url, postId);

  if (postId) {
    res.redirect('/post/' + postId);
  } else {
    res.redirect('/404.html');
  }
};

module.exports.map = map;
