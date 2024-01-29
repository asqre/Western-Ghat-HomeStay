import fs from 'fs';
import pdfMake from 'pdfmake/build/pdfmake.js';
import pdfFonts from 'pdfmake/build/vfs_fonts.js';
import htmlToPdfMake from 'html-to-pdfmake';
import { JSDOM } from 'jsdom';


pdfMake.vfs = pdfFonts.pdfMake.vfs;

export const generatePDF = (htmlTemplate, res) => {
  const { window } = new JSDOM('');
  const htmlToPdfMakeOptions = { window };

  // const html = htmlToPdfMake(htmlTemplate, { window: {} });
  const html = htmlToPdfMake(htmlTemplate, htmlToPdfMakeOptions);


  const docDefinition = {
    content: [html],
    styles: {
      'html-h1': {
        color: '#003366',
        background: 'white',
      },
    },
  };

  const pdfDocGenerator = pdfMake.createPdf(docDefinition);

  pdfDocGenerator.getBuffer((buffer) => {
    res.contentType('application/pdf');
    res.send(buffer);
  });
};
