import React from 'react';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import ReadingTsUnit from './readingTsUnit';


/**

 */
/**
 * @author Fabiola Badillo Ramos
 * Draws a react component consisting on the profile information for the NIST equipment
 * it should be called from a page that provides the props for each field
 * @param {
 * manufacturer, nistNumber, model, serialNumber, calDate,
 * nomLowTemp, nomLowTempTs, nomMedTemp, nomMedTempTs, nomHighTemp,
 * nomHighTempTs, nomLowRh, nomLowRhTs, nomMedRh, nomMedRhTs, nomHighRh, nomHighRhTs
 * } props 
 * @returns 
 */

function NistProfileComp(props) {


    const values = props.formik.values;
    console.log(values)
    const formik = props.formik
    return (
        <div>
           
                                <Typography style={{ fontWeight: 600 , marginRight:'5%'}}>Manufacturer: </Typography>
                                <TextField defaultValue= {values.nistManuf}
                                id="nistManuf"
                                name="nistManuf"
                                type="text"
                                onChange={formik.handleChange}
                                error={formik.touched.nistManuf && Boolean(formik.errors.nistManuf)}
                                helperText={formik.touched.nistManuf && formik.errors.nistManuf}
                                value= {values.nistManuf}
                                variant={props.readOnly ? "standard": "filled"} 
                                InputProps={{readOnly: props.readOnly,}} />
                                
                   
                                <Typography  style={{ fontWeight: 600 , marginRight:'5%'}}> NIST Number: </Typography>
                                <TextField defaultValue= {values.nistNumber}
                                id="nistNumber"
                                name="nistNumber"
                                type="text"
                                onChange={formik.handleChange}
                                error={formik.touched.nistNumber && Boolean(formik.errors.nistNumber)}
                                helperText={formik.touched.nistNumber && formik.errors.nistNumber}
                                value= {values.nistNumber}
                                variant={props.readOnly ? "standard": "filled"} 
                                InputProps={{readOnly: props.readOnly,}} /> 
                  
                                <Typography  style={{ fontWeight: 600 , marginRight:'5%'}}> Model:</Typography>
                                <TextField defaultValue= {values.nistModel}
                                id="nistModel"
                                name="nistModel"
                                type="text"
                                onChange={formik.handleChange}
                                error={formik.touched.nistModel && Boolean(formik.errors.nistModel)}
                                helperText={formik.touched.nistModel && formik.errors.nistModel}
                                value= {values.nistModel}
                                variant={props.readOnly ? "standard": "filled"} 
                                InputProps={{readOnly: props.readOnly,}}> </TextField>
                       
                                <Typography  style={{ fontWeight: 600 , marginRight:'5%'}}> Serial Number: </Typography>
                                <TextField defaultValue={values.nistSerNum}
                                id="nistSerNum"
                                name="nistSerNum"
                                type="text"
                                onChange={formik.handleChange}
                                error={formik.touched.nistSerNum && Boolean(formik.errors.nistSerNum)}
                                helperText={formik.touched.nistSerNum && formik.errors.nistSerNum}
                                value= {values.nistSerNum}
                                variant={props.readOnly ? "standard": "filled"} 
                                InputProps={{readOnly: props.readOnly,}} />
                      
                                <Typography  style={{ fontWeight: 600 , marginRight:'5%'}}> Calibration Date:</Typography>  
                                <TextField defaultValue={values.calDate}
                                id="calDate"
                                name="calDate"
                                type="date"
                                onChange={formik.handleChange}
                                error={formik.touched.calDate && Boolean(formik.errors.calDate)}
                                helperText={formik.touched.calDate && formik.errors.calDate}
                                value= {values.calDate}
                                variant={props.readOnly ? "standard": "filled"} 
                                InputProps={{readOnly: props.readOnly,}} />
                     
                    {/* nominal readings for temperature */}
                                
                                    <Typography style={{ fontWeight: 600 , marginRight:'5%'}}> Nominal Low Temperature (F°):</Typography>
                                    <TextField defaultValue={values.lowTemp}
                                    id="lowTemp"
                                    name="lowTemp"
                                    type="number"
                                    value={values.lowTemp}
                                    onChange={formik.handleChange}
                                    error={formik.touched.lowTemp && Boolean(formik.errors.lowTemp)}
                                    helperText={formik.touched.lowTemp && formik.errors.lowTemp}
                                    variant={props.readOnly ? "standard": "filled"} 
                                    InputProps={{readOnly: props.readOnly,}}> </TextField>
                            
                                    <Typography style={{ fontWeight: 600 , marginRight:'5%'}}> Timestamp: </Typography>
                                    <TextField defaultValue={values.lowTempTs}
                                    id="lowTempTs"
                                    name="lowTempTs"
                                    type="datetime-local"
                                    value={values.lowTempTs}
                                    onChange={formik.handleChange}
                                    error={formik.touched.lowTempTs && Boolean(formik.errors.lowTempTs)}
                                    helperText={formik.touched.lowTempTs && formik.errors.lowTempTs}
                                    variant={props.readOnly ? "standard": "filled"} 
                                    InputProps={{readOnly: props.readOnly,}} />

                                    <Typography style={{ fontWeight: 600 , marginRight:'5%'}}> Nominal Med Temperature (F°):</Typography>
                                    <TextField defaultValue={values.medTemp}
                                    id="medTemp"
                                    name="medTemp"
                                    type="number"
                                    value={values.medTemp}
                                    onChange={formik.handleChange}
                                    error={formik.touched.medTemp && Boolean(formik.errors.medTemp)}
                                    helperText={formik.touched.medTemp && formik.errors.medTemp}
                                    variant={props.readOnly ? "standard": "filled"} 
                                    InputProps={{readOnly: props.readOnly,}} />                                
                        
                                    <Typography style={{ fontWeight: 600 , marginRight:'5%'}}> Timestamp:</Typography>
                                    <TextField defaultValue={values.medTempTs}
                                    id="medTempTs"
                                    name="medTempTs"
                                    type="datetime-local"
                                    value={values.medTempTs}
                                    onChange={formik.handleChange}
                                    error={formik.touched.medTempTs && Boolean(formik.errors.medTempTs)}
                                    helperText={formik.touched.medTempTs && formik.errors.medTempTs}
                                    variant={props.readOnly ? "standard": "filled"} 
                                    InputProps={{readOnly: props.readOnly,}} />

                                    <Typography style={{ fontWeight: 600 , marginRight:'5%'}}> Nominal High Temperature (F°): </Typography>
                                    <TextField defaultValue= {values.highTemp}
                                    id="highTemp"
                                    name="highTemp"
                                    type="number"
                                    value={values.highTemp}
                                    onChange={formik.handleChange}
                                    error={formik.touched.highTemp && Boolean(formik.errors.highTemp)}
                                    helperText={formik.touched.highTemp && formik.errors.highTemp}
                                    variant={props.readOnly ? "standard": "filled"} 
                                    InputProps={{readOnly: props.readOnly,}} / >
                                
                                    <Typography style={{ fontWeight: 600 , marginRight:'5%'}}> Timestamp:</Typography>
                                    <TextField defaultValue= {values.highTempTs}
                                    id="highTempTs"
                                    name="highTempTs"
                                    type="datetime-local"
                                    onChange={formik.handleChange}
                                    value={values.highTempTs}
                                    error={formik.touched.highTempTs && Boolean(formik.errors.highTempTs)}
                                    helperText={formik.touched.highTempTs && formik.errors.highTempTs}
                                    variant={props.readOnly ? "standard": "filled"} 
                                    InputProps={{readOnly: props.readOnly,}} />
                                    {/* nominal readings for relative humidity */}
                                    <Typography style={{ fontWeight: 600 , marginRight:'5%'}}> Nominal Low Relative Humidity(%):</Typography>
                                    <TextField defaultValue= {values.lowRh}
                                    id="lowRh"
                                    name="lowRh"
                                    type="number"
                                    value={values.lowRh}
                                    onChange={formik.handleChange}
                                    error={formik.touched.lowRh && Boolean(formik.errors.lowRh)}
                                    helperText={formik.touched.lowRh && formik.errors.lowRh}
                                    variant={props.readOnly ? "standard": "filled"} 
                                    InputProps={{readOnly: props.readOnly,}} />
                               
                                    <Typography style={{ fontWeight: 600 , marginRight:'5%'}}> Timestamp: </Typography>
                                    <TextField 
                                    // defaultValue= {values.lowRhTs}
                                    id="lowRhTs"
                                    name="lowRhTs"
                                    type="datetime-local"
                                    onChange={formik.handleChange}
                                    value={values.lowRhTs}
                                    error={formik.touched.lowRhTs && Boolean(formik.errors.lowRhTs)}
                                    helperText={formik.touched.lowRhTs && formik.errors.lowRhTs}
                                    variant={props.readOnly ? "standard": "filled"} 
                                    InputProps={{readOnly: props.readOnly,}}/>
                              
                           
                                    <Typography style={{ fontWeight: 600 , marginRight:'5%'}}> Nominal Med Relative Humidity(%): </Typography>
                                    <TextField defaultValue= {values.medRh}
                                        id="medRh"
                                        name="medRh"
                                        type="number"
                                        value={values.medRh}
                                        onChange={formik.handleChange}
                                        error={formik.touched.medRh && Boolean(formik.errors.medRh)}
                                        helperText={formik.touched.medRh && formik.errors.medRh}
                                        variant={props.readOnly ? "standard": "filled"} 
                                        InputProps={{readOnly: props.readOnly,}}/>
                              
                                    <Typography style={{ fontWeight: 600 , marginRight:'5%'}}> Timestamp: </Typography>
                                    <TextField
                                    // defaultValue={values.medRhTs}
                                    id="medRhTs"
                                    name="medRhTs"
                                    type="datetime-local"
                                    onChange={formik.handleChange}
                                    error={formik.touched.medRhTs && Boolean(formik.errors.medRhTs)}
                                    helperText={formik.touched.medRhTs && formik.errors.medRhTs}
                                    value= {values.medRhTs}
                                    variant={props.readOnly ? "standard": "filled"} 
                                    InputProps={{readOnly: props.readOnly,}} />
                              
                                    <Typography style={{ fontWeight: 600 , marginRight:'5%'}}> Nominal High Relative Humidity(%): </Typography>
                                    <TextField defaultValue={values.highRh}
                                    id="highRh"
                                    name="highRh"
                                    type="number"
                                    onChange={formik.handleChange}
                                    value={values.highRh}
                                    error={formik.touched.highRh && Boolean(formik.errors.highRh)}
                                    helperText={formik.touched.highRh && formik.errors.highRh}
                                    variant={props.readOnly ? "standard": "filled"} 
                                    InputProps={{readOnly: props.readOnly,}}> </TextField>
                              
                                    <Typography style={{ fontWeight: 600 , marginRight:'5%'}}> Timestamp: </Typography>
                                    <TextField defaultValue={values.highRhTs}
                                    id="highRhTs"
                                    name="highRhTs"
                                    type="datetime-local"
                                    onChange={formik.handleChange}
                                    value={values.highRhTs}
                                    error={formik.touched.highRhTs && Boolean(formik.errors.highRhTs)}
                                    helperText={formik.touched.highRhTs && formik.errors.highRhTs}
                                    variant={props.readOnly ? "standard": "filled"} 
                                    InputProps={{readOnly: props.readOnly,}}> </TextField>
            
        </div>
    )
}

export default NistProfileComp

