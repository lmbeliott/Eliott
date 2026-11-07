#include <iostream>
#include <string>
using namespace std;

// Segments allumés pour chaque chiffre, de 0 à 9.
const string SEGMENTS[10] = {"abcdef", "bc", "abdeg", "abcdg", "bcfg",
                             "acdfg", "acdefg", "abc", "abcdefg", "abcdfg"};

int en_minutes(const string& horaire) {
    // "09:59" -> 9 * 60 + 59
    int h = (horaire[0] - '0') * 10 + (horaire[1] - '0');
    int m = (horaire[3] - '0') * 10 + (horaire[4] - '0');
    return h * 60 + m;
}

int chiffre(int t, int i) {
    // Le i-ème des quatre chiffres affichés à la minute t.
    int h = t / 60, m = t % 60;
    if (i == 0) return h / 10;
    if (i == 1) return h % 10;
    if (i == 2) return m / 10;
    return m % 10;
}

bool allume(int x, char s) {
    return SEGMENTS[x].find(s) != string::npos;
}

int bascules(int x, int y) {
    // Nombre de segments allumés dans un seul des deux chiffres.
    int n = 0;
    for (char s = 'a'; s <= 'g'; s++) {
        if (allume(x, s) != allume(y, s)) n++;
    }
    return n;
}

int transition(int t) {
    // Bascules entre la minute t et la minute suivante.
    int suivante = (t + 1) % 1440;
    int total = 0;
    for (int i = 0; i < 4; i++) {
        total += bascules(chiffre(t, i), chiffre(suivante, i));
    }
    return total;
}

int main() {
    int q;
    cin >> q;
    for (int k = 0; k < q; k++) {
        string depart, arrivee;
        cin >> depart >> arrivee;
        int t = en_minutes(depart);
        int fin = en_minutes(arrivee);
        int total = 0;
        while (t != fin) {
            total += transition(t);
            t = (t + 1) % 1440;
        }
        cout << total << "\n";
    }
    return 0;
}
