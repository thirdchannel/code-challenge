package com.android.thirdchannel;

import android.Manifest;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Bundle;
import android.support.v4.app.ActivityCompat;
import android.support.v4.content.ContextCompat;
import android.support.v7.app.AppCompatActivity;
import android.view.View;
import android.widget.TextView;
import android.widget.Toast;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.HashMap;
import java.util.Objects;

public class MainActivity extends AppCompatActivity {

    private final int PICKFILE_RESULT_CODE = 101;
    private boolean btnClickFlag = false;
    private String templateText = "";
    private String resultText = "";
    private TextView tvResult, tvTemplate, tvLblResult, tvLblTemplate;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        requestAppPermissions();
        tvResult = findViewById(R.id.tv_show_result);
        tvTemplate = findViewById(R.id.tv_show_template);
        tvLblTemplate = findViewById(R.id.tv_template);
        tvLblResult = findViewById(R.id.tv_result);
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        if (requestCode == PICKFILE_RESULT_CODE) {
            if (resultCode == -1) {
                Uri uri = data.getData();
                String fileContent = readTextFile(uri);
                if (!btnClickFlag) {
                    templateText = fileContent;
                }
                if (!templateText.equals("")) {
                    tvTemplate.setText(templateText);
                    tvLblTemplate.setVisibility(View.VISIBLE);
                }
                if (!resultText.equals("") && btnClickFlag) {
                    tvResult.setText(resultText);
                    tvLblResult.setVisibility(View.VISIBLE);
                }
            }
        }
    }

    public void btnOnTemplateClick(View view) {
        btnClickFlag = false;
        fileSelector();
    }


    public void btnOnTemplateValueClick(View view) {
        btnClickFlag = true;
        resultText = templateText;
        fileSelector();
    }

    private String readTextFile(Uri uri) {
        BufferedReader reader;
        StringBuilder builder = new StringBuilder();
        try {
            reader = new BufferedReader(new InputStreamReader(Objects.requireNonNull(getContentResolver().openInputStream(uri))));
            String line;
            while (null != (line = reader.readLine())) {
                if (btnClickFlag) {
                    if (!line.trim().equals("")) {
                        String[] value = line.split("=");
                        String key = value[0].trim();
                        if (!key.equals("")) {
                            String val = value[1].trim();
                            resultText = resultText.replace("((" + key + "))", val);
                        }
                    }
                }
                builder.append(line + "\n");
            }
            reader.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return builder.toString();
    }

    private void fileSelector() {
        Intent chooseFile = new Intent(Intent.ACTION_GET_CONTENT);
        chooseFile.setType("text/plain");
        chooseFile = Intent.createChooser(chooseFile, "Choose a file");
        startActivityForResult(chooseFile, PICKFILE_RESULT_CODE);
    }

    private void requestAppPermissions() {
        if (hasReadPermissions()) {
            return;
        }
        int REQUEST_WRITE_STORAGE_REQUEST_CODE = 100;
        ActivityCompat.requestPermissions(this,
                new String[]{
                        Manifest.permission.READ_EXTERNAL_STORAGE,
                        Manifest.permission.WRITE_EXTERNAL_STORAGE
                }, REQUEST_WRITE_STORAGE_REQUEST_CODE);
    }

    private boolean hasReadPermissions() {
        return (ContextCompat.checkSelfPermission(getBaseContext(), Manifest.permission.READ_EXTERNAL_STORAGE) == PackageManager.PERMISSION_GRANTED);
    }
}
