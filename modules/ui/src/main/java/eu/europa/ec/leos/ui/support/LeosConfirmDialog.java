package eu.europa.ec.leos.ui.support;

import com.vaadin.server.Sizeable;
import com.vaadin.ui.Alignment;
import com.vaadin.ui.Button;
import com.vaadin.ui.HorizontalLayout;
import com.vaadin.ui.Label;
import com.vaadin.ui.Panel;
import com.vaadin.ui.UI;
import com.vaadin.ui.VerticalLayout;
import com.vaadin.ui.Window;
import org.vaadin.dialogs.ConfirmDialog;

import java.text.NumberFormat;
import java.util.Arrays;
import java.util.Iterator;
import java.util.List;
import java.util.Locale;

public class LeosConfirmDialog extends ConfirmDialog {
    private static final long serialVersionUID = -5412321247707480466L;
    protected static final String DEFAULT_CAPTION = "Confirm";
    protected static final String DEFAULT_OK_CAPTION = "Ok";
    protected static final String DEFAULT_CANCEL_CAPTION = "Cancel";
    private static final double MIN_WIDTH = 20.0D;
    private static final double MAX_WIDTH = 40.0D;
    private static final double MIN_HEIGHT = 1.0D;
    private static final double MAX_HEIGHT = 30.0D;

    public LeosConfirmDialog(String caption, String message, String okCaption, String cancelCaption, String notOkCaption, Boolean isClosable) {
        super();
        boolean threeWay = notOkCaption != null;
        boolean twoWay = cancelCaption != null;
        setId("confirmdialog-window");
        setCaption(caption != null ? caption : DEFAULT_CAPTION);
        ConfirmDialog confirm = this;
        this.setClosable(isClosable);
        addCloseListener(new Window.CloseListener() {
            private static final long serialVersionUID = 1971800928047045825L;

            public void windowClose(Window.CloseEvent ce) {
                if (isEnabled()) {
                    setEnabled(false);
                    setConfirmed(false);
                    if (getListener() != null) {
                        getListener().onClose(confirm);
                    }
                }

            }
        });
        VerticalLayout c = new VerticalLayout();
        setContent(c);
        c.setSizeFull();
        c.setSpacing(true);
        c.setMargin(true);
        VerticalLayout scrollContent = new VerticalLayout();
        scrollContent.setMargin(false);
        Panel panel = new Panel(scrollContent);
        c.addComponent(panel);
        panel.setWidth("100%");
        panel.setHeight("100%");
        panel.setStyleName("borderless");
        panel.addStyleName("borderless");
        c.setExpandRatio(panel, 1.0F);
        Label text = new Label("",
                com.vaadin.shared.ui.ContentMode.HTML);
        text.setWidth(100.0F, Sizeable.Unit.PERCENTAGE);
        text.setId("confirmdialog-message");
        scrollContent.addComponent(text);
        setMessageLabel(text);
        setMessage(message);
        HorizontalLayout buttons = new HorizontalLayout();
        c.addComponent(buttons);
        c.setComponentAlignment(buttons, Alignment.TOP_RIGHT);
        buttons.setSpacing(true);
        Button cancel = null;
        if (twoWay) {
            cancel = this.buildCancelButton(cancelCaption);
            setCancelButton(cancel);
        }
        Button notOk = null;
        if (threeWay) {
            notOk = this.buildNotOkButton(notOkCaption);
            setNotOkButton(notOk);
        }

        final Button ok = this.buildOkButton(okCaption);
        setOkButton(ok);
        Button.ClickListener cb = new Button.ClickListener() {
            private static final long serialVersionUID = 3525060915814334881L;

            public void buttonClick(Button.ClickEvent event) {
                if (isEnabled()) {
                    setEnabled(false);
                    Button b = event.getButton();
                    if (b == ok) {
                        setConfirmed(b == ok);
                    }

                    UI parent = getUI();
                    parent.removeWindow(confirm);
                    if (getListener() != null) {
                        getListener().onClose(confirm);
                    }
                }

            }
        };
        if (twoWay) {
            cancel.addClickListener(cb);
        }
        ok.addClickListener(cb);
        if (notOk != null) {
            notOk.addClickListener(cb);
        }

        Iterator var17 = this.orderButtons(cancel, notOk, ok).iterator();

        while(var17.hasNext()) {
            Button button = (Button)var17.next();
            if (button != null) {
                buttons.addComponent(button);
            }
        }

        double[] dim = this.getDialogDimensions(message, org.vaadin.dialogs.ConfirmDialog.ContentMode.TEXT_WITH_NEWLINES);
        setWidth(this.format(dim[0]) + "em");
        setHeight(this.format(dim[1]) + "em");
        setResizable(false);
    }

    protected List<Button> orderButtons(Button cancel, Button notOk, Button ok) {
        return Arrays.asList(cancel, notOk, ok);
    }

    protected Button buildCancelButton(String cancelCaption) {
        Button cancel = new Button(cancelCaption != null ? cancelCaption : DEFAULT_CANCEL_CAPTION);
        cancel.setData((Object)null);
        cancel.setId("confirmdialog-cancel-button");
        return cancel;
    }

    protected Button buildNotOkButton(String notOkCaption) {
        Button notOk = new Button(notOkCaption);
        notOk.setData(false);
        notOk.setId("confirmdialog-not-ok-button");
        return notOk;
    }

    protected Button buildOkButton(String okCaption) {
        Button ok = new Button(okCaption != null ? okCaption : DEFAULT_OK_CAPTION);
        ok.setData(true);
        ok.setId("confirmdialog-ok-button");
        ok.setClickShortcut(13, new int[0]);
        ok.setStyleName("primary");
        ok.focus();
        return ok;
    }

    protected double[] getDialogDimensions(String message, org.vaadin.dialogs.ConfirmDialog.ContentMode style) {
        double chrW = 0.51D;
        double chrH = 1.5D;
        double length = message != null ? chrW * (double)message.length() : 0.0D;
        double rows = Math.ceil(length / MAX_WIDTH);
        if (style == org.vaadin.dialogs.ConfirmDialog.ContentMode.TEXT_WITH_NEWLINES) {
            rows += message != null ? (double)count("\n", message) : 0.0D;
        }

        double width = Math.min(MAX_WIDTH, length);
        double height = Math.ceil(Math.min(MAX_HEIGHT, rows * chrH));
        width = Math.max(width, MIN_WIDTH);
        height = Math.max(height, MIN_HEIGHT);
        double btnHeight = 4.0D;
        double vmargin = 5.0D;
        double hmargin = MIN_HEIGHT;
        double[] res = new double[]{width + hmargin, height + btnHeight + vmargin};
        return res;
    }

    private static int count(String needle, String haystack) {
        int count = 0;

        for(int pos = -1; (pos = haystack.indexOf(needle, pos + 1)) >= 0; ++count) {
        }

        return count;
    }

    private String format(double n) {
        NumberFormat nf = NumberFormat.getNumberInstance(Locale.ENGLISH);
        nf.setMaximumFractionDigits(1);
        nf.setGroupingUsed(false);
        return nf.format(n);
    }
}
