var xmlScribe = 
{

  writeNode: function(xml, element, addTo, text=false, attrs=false)
  {
    var parentNode = '',
        pnIndex = 0;
    
    if (jQuery.type(addTo) == 'object')
    {
      parentNode = addTo.parentNode;
      pnIndex = addTo.pnIndex;
    }
    else
    {
      parentNode = addTo;
      pnIndex = 0;
    }
     
    newEle = xml.createElement(element);
    
    if (text)
    {
      newText=xml.createTextNode(text);
      newEle.appendChild(newText);
    }
    
    xml.getElementsByTagName(parentNode)[pnIndex].appendChild(newEle);
    
    var last = xml.getElementsByTagName(parentNode)[pnIndex].length;
    
    if (attrs)
    {
      xmlScribe.addAttrs(xml, element, attrs, last);
    }
    
  },
  
  createNode(xml, element, addTo=false, text=false, attrs=false)
  {
    var parentNode = '',
        pnIndex = 0;
    
    if (jQuery.type(addTo) == 'object')
    {
      parentNode = addTo.parentNode;
      pnIndex = addTo.pnIndex;
    }
    else
    {
      parentNode = addTo;
      pnIndex = 0;
    }
    
    var newEle = xml.createElement(element);
    
    var newText=xml.createTextNode(text);
    newEle.appendChild(newText); 
      
    xml.getElementsByTagName(parentNode)[pnIndex].childNodes[2].appendChild(newEle);
      
  },
  
  addAttrs: function (xml, element, attrs, parentNode='all')
  {
    
    nodes = xml.getElementsByTagName(element);
    
    if ($.isArray(parentNode) || parentNode == 'all')
    {
      addSelected(xml, nodes, attrs, parentNode);
    }
    else
    {
      addSingle(xml, nodes, attrs, parentNode);
    }
    
    function addSelected(xml, nodes, attrs, parentNode='all')
    {
        for (i=0;i<nodes.length;i++)
        {
          if (parentNode == 'all' || $.inArray(i, parentNode) >= 0) 
          {
            for (var key in attrs) {
              nodes[i].setAttribute(key, attrs[key]);
          }   
        }
      }
    }
    
    function addSingle(xml, nodes, attrs, parentNode='all')
    {

      if (parentNode == 'first')
      {
        i = 0;
      }
      else if (parentNode == 'last')
      {
        i = nodes.length - 1;
      }
      else if ($.isNumeric(parentNode))
      {
        i = parentNode;
      }
      else {
        alert ('Invalid value in parentNode');
        return false;
      }
      
      for (var key in attrs)
      {
        nodes[i].setAttribute(key, attrs[key]);
      }   
    }
  }
};