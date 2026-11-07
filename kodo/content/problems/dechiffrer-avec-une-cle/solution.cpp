#include <iostream>
#include <string>
using namespace std;

char decaler(char lettre, int decalage) {
    // recule la lettre de « decalage » rangs dans l'alphabet, en revenant à z après a
    int rang = ((lettre - 'a' - decalage) % 26 + 26) % 26;
    return (char)('a' + rang);
}

int main() {
    string cle, message;
    getline(cin, cle);
    getline(cin, message);

    string clair = "";
    int k = 0;                  // position dans la clé
    for (char c : message) {
        if (c == ' ') {
            clair += ' ';
        } else {
            int decalage = cle[k % cle.size()] - 'a';
            clair += decaler(c, decalage);
            k = k + 1;          // seules les lettres consomment la clé
        }
    }
    cout << clair << "\n";
    return 0;
}
