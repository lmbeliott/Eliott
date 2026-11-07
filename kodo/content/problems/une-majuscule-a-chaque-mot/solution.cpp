#include <cctype>
#include <iostream>
#include <string>
using namespace std;

int main() {
    int n;
    cin >> n;
    for (int k = 0; k < n; k++) {
        string m;
        cin >> m;
        m[0] = toupper(m[0]);                  // première lettre en majuscule
        for (int i = 1; i < (int) m.size(); i++) {
            m[i] = tolower(m[i]);              // le reste en minuscules
        }
        if (k > 0) {
            cout << " ";
        }
        cout << m;
    }
    cout << "\n";
    return 0;
}
