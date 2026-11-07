#include <iostream>
#include <string>
#include <set>
using namespace std;

int main() {
    int n;
    cin >> n;
    string mot;
    cin >> mot;
    set<char> communes;                              // les lettres du premier mot
    for (char c : mot) {
        communes.insert(c);
    }
    for (int i = 1; i < n; i++) {
        cin >> mot;
        set<char> lettres;
        for (char c : mot) {
            lettres.insert(c);
        }
        set<char> garder;                            // intersection
        for (char c : communes) {
            if (lettres.count(c) > 0) {
                garder.insert(c);
            }
        }
        communes = garder;
    }

    string reponse = "";
    for (char c = 'a'; c <= 'z'; c++) {              // ordre alphabétique
        if (communes.count(c) > 0) {
            reponse += c;
        }
    }
    if (reponse == "") {
        reponse = "AUCUNE";
    }
    cout << reponse << "\n";
    return 0;
}
