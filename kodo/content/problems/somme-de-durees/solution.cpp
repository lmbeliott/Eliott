#include <iostream>
#include <string>
using namespace std;

int en_minutes(string horaire) {
    // "08:45" -> 8 * 60 + 45 = 525
    int heures = (horaire[0] - '0') * 10 + (horaire[1] - '0');
    int minutes = (horaire[3] - '0') * 10 + (horaire[4] - '0');
    return heures * 60 + minutes;
}

string deux_chiffres(int n) {
    // 7 -> "07", 45 -> "45", 123 -> "123"
    if (n < 10) {
        return "0" + to_string(n);
    }
    return to_string(n);
}

string en_texte(int duree) {
    // 525 -> "08:45"
    return deux_chiffres(duree / 60) + ":" + deux_chiffres(duree % 60);
}

int main() {
    int n;
    cin >> n;
    int total = 0;
    for (int i = 0; i < n; i++) {
        string debut, fin;
        cin >> debut >> fin;
        total += en_minutes(fin) - en_minutes(debut);
    }
    cout << en_texte(total) << "\n";
    return 0;
}
