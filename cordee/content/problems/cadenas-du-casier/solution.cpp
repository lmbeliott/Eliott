#include <iostream>
#include <string>
#include <vector>
using namespace std;

int n;
string code;
vector<string> codes;

// reste : somme encore à atteindre ; plus_petit : chiffre minimal autorisé
void explorer(int reste, int plus_petit) {
    int places = n - code.size();   // nombre de chiffres encore à choisir
    if (places == 0) {
        if (reste == 0) codes.push_back(code);
        return;
    }
    for (int c = plus_petit; c <= 9; c++) {
        if (c * places > reste) break;           // les chiffres suivants sont >= c : trop grand
        if (c + 9 * (places - 1) < reste) continue; // même avec des 9 ensuite, trop petit
        code.push_back('0' + c);
        explorer(reste - c, c);
        code.pop_back();
    }
}

int main() {
    int s;
    cin >> n >> s;
    explorer(s, 0);
    cout << codes.size() << "\n";
    for (const string& c : codes) cout << c << "\n";
    return 0;
}
